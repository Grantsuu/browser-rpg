import { QueryClient, useQueryClient, useMutation } from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDice } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import type { Bounty, Character, CharacterLevels, Crop, Fish, Monster, Recipe } from "@src/types";
import { insertBounty } from '@lib/apiClient';
import { useCharacter, useCharacterBounties } from '@lib/stateMangers';
import { toTitleCase } from '@utils/strings';
import PageCard from "@src/layouts/PageCard";
import BountyCard from "./BountyCard";
import ColumnDelayDown from "@components/Animated/Motion/ColumnDelayDown";
import ButtonPress from "@src/components/Animated/Button/ButtonPress";

const rollNewBounty = async (client: QueryClient) => {
    // Don't roll a new bounty if the character already has 3 bounties
    const bounties: Bounty[] | undefined = client.getQueryData(['characterBounties']);
    if (bounties && bounties.length >= 3) {
        toast.error('You already have 3 bounties. Complete or remove one before rolling a new one.');
        return;
    }

    // Combat appears twice to increase the chance of getting a combat bounty
    // This is a temporary solution until we have a better way to balance the bounties
    const skills = ['fishing', 'farming', 'cooking', 'combat', 'combat'];

    // Get the character for the bounty character id
    const character: Character | undefined = client.getQueryData(['character']);
    const characterLevels: CharacterLevels | undefined = client.getQueryData(['characterLevels']);

    if (!character || !characterLevels) {
        toast.error('Character not found. Please refresh the page.');
        return;
    }

    // Initialize a new bounty with a random uuid, character_id, random skill and a random quantity between 25 and 75
    const bounty: Bounty = {
        id: uuidv4(),
        character_id: character?.id,
        name: '',
        category: '',
        skill: skills[Math.floor(Math.random() * skills.length)],
        description: '',
        required_quantity: Math.floor(Math.random() * (75 - 25 + 1)) + 25,
        required_progress: 0,
        experience: 0,
        gold: 0,
        bounty_tokens: 0
    };

    // Assign category based on skill
    if (bounty.skill === 'combat') {
        bounty.category = 'combat';
    }
    if (bounty.skill === 'fishing' || bounty.skill === 'farming') {
        bounty.category = 'gathering';
    }
    if (bounty.skill === 'cooking') {
        bounty.category = 'crafting';
    }

    // Randomly choose a bounty based on skill and character level
    if (bounty.skill === 'combat') {
        // Get a random monster from the database that is less than or equal to the character's combat level
        let monsters: Monster[] | undefined = client.getQueryData(['allMonsters']);
        if (!monsters) {
            toast.error('Monsters not found. Please refresh the page.');
            return;
        }
        monsters = monsters.filter((monster: Monster) => monster.level <= characterLevels.combat_level);
        bounty.required_monster = monsters[Math.floor(Math.random() * monsters.length)];
        // Set the bounty name based on the monster name
        bounty.name = `Slay - ${bounty.required_monster.name}`;
        // Set experience based on monster experience and quantity
        bounty.experience = Math.floor(bounty.required_monster.experience / 4 * bounty.required_quantity);
        // Set gold based on monster level and quantity
        bounty.gold = Math.floor(bounty.required_monster.level * bounty.required_quantity);
        // Set bounty tokens based on quantity
        bounty.bounty_tokens = Math.floor(bounty.required_quantity / 10);
    } else {
        if (bounty.skill === 'fishing') {
            let fish: Fish[] | undefined = client.getQueryData(['allFishing']);
            if (!fish) {
                toast.error('Fish not found. Please refresh the page.');
                return;
            }
            fish = fish.filter((fish: Fish) => fish.required_level <= characterLevels.fishing_level);
            bounty.required_item = fish[Math.floor(Math.random() * fish.length)].item;
            bounty.experience = Math.floor(fish[Math.floor(Math.random() * fish.length)].experience / 4 * bounty.required_quantity);
        } else if (bounty.skill === 'farming') {
            let crops: Crop[] | undefined = client.getQueryData(['allCrops']);
            if (!crops) {
                toast.error('Crops not found. Please refresh the page.');
                return;
            }
            crops = crops.filter((crop: Crop) => crop.required_level <= characterLevels.farming_level);
            bounty.required_item = crops[Math.floor(Math.random() * crops.length)].product;
            bounty.experience = Math.floor(crops[Math.floor(Math.random() * crops.length)].experience / 4 * bounty.required_quantity);
        } else if (bounty.skill === 'cooking') {
            let cookingRecipes: Recipe[] | undefined = client.getQueryData(['allCooking']);
            if (!cookingRecipes) {
                toast.error('Cooking recipes not found. Please refresh the page.');
                return;
            }
            cookingRecipes = cookingRecipes.filter((recipe: Recipe) => recipe.category === 'cooking' && recipe.required_level <= characterLevels.cooking_level);
            bounty.required_item = cookingRecipes[Math.floor(Math.random() * cookingRecipes.length)].item;
            bounty.experience = Math.floor(cookingRecipes[Math.floor(Math.random() * cookingRecipes.length)].experience / 2 * bounty.required_quantity);
        }
        if (!bounty.required_item) {
            toast.error('Item not found. Please refresh the page.');
            return;
        }
        // Set the bounty name based on the skill and item name
        bounty.name = `${toTitleCase(bounty.skill)} - ${bounty.required_item.name}`;
        bounty.gold = Math.floor(bounty.required_item.value * bounty.required_quantity / 2);
        bounty.bounty_tokens = Math.floor(bounty.required_quantity / 10);
    }

    return bounty;
}

const BountyBoard = () => {
    const queryClient = useQueryClient();
    const { data: character } = useCharacter();
    const { data: bounties, isLoading: isBountiesLoading } = useCharacterBounties();

    const { mutateAsync: rollBounty } = useMutation({
        mutationKey: ['characterBounties'],
        mutationFn: async (variables: { newBounty: Bounty }) => {
            await queryClient.cancelQueries({ queryKey: ['characterBounties'] });
            const newBounty = await rollNewBounty(queryClient);
            if (!newBounty) return;
            variables.newBounty = newBounty;
            // Optimistically update the bounties
            queryClient.setQueryData(['characterBounties'], (oldBounties: Bounty[] | undefined) => {
                if (!oldBounties) return [newBounty];
                return [...oldBounties, newBounty];
            });
            await insertBounty(variables.newBounty);
        },
        onError: (_, variables) => {
            toast.error(`Error rolling new bounty please try again.`);
            queryClient.setQueryData(['characterBounties'], (oldBounties: Bounty[] | undefined) => {
                if (!oldBounties) return [];
                return oldBounties.filter((bounty: Bounty) => bounty.id !== variables.newBounty.id);
            });
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['characterBounties'] });
        }
    });

    return (
        <PageCard
            title="Bounty Board"
            icon='/images/bounty-board.png'
            titleContent={
                <div className="border-1 border-base rounded-md bg-base-300 p-2">
                    <div className="flex flex-row gap-2 items-center">
                        <img src="/images/bounty_token.png" alt="Bounty Board" className="w-5 h-5" />
                        <span className="text-sm font-bold">Bounty Tokens: {character.bounty_tokens}</span>
                    </div>
                </div>
            }
        >
            <div className="flex flex-col gap-2">
                <div className="flex flex-row justify-between">
                    <div className="join">
                        <input className="join-item btn" type="radio" name="options" aria-label="Bounties" defaultChecked onClick={() => { }} />
                        <input className="join-item btn" type="radio" name="options" aria-label="Shop" onClick={() => { }} />
                    </div>
                    <ButtonPress className="btn-primary" onClick={() => rollBounty({ newBounty: {} as Bounty })}>
                        Roll Bounty <FontAwesomeIcon icon={faDice as IconProp} />
                    </ButtonPress>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl: xl:grid-cols-3 gap-4">
                    {isBountiesLoading ?
                        [...Array(3).keys()].map((index) => {
                            return (
                                <div className="skeleton h-32 w-full" key={index} />
                            )
                        })
                        : bounties?.map((bounty: Bounty, index: number) => (
                            <ColumnDelayDown key={index} index={index}>
                                <BountyCard bounty={bounty} />
                            </ColumnDelayDown>
                        ))}
                </div>
            </div>
        </PageCard>
    );
};

export default BountyBoard;