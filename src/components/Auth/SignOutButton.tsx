import { useNavigate } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import { clsx } from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { getLogout } from '../../lib/apiClient';
import ButtonPress from '../Animated/Button/ButtonPress';

interface SignOutButtonProps {
    className?: React.HTMLAttributes<HTMLDivElement>['className'];
}

const SignOutButton = ({ className }: SignOutButtonProps) => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    async function handleSignout() {
        try {
            await getLogout();
        } catch (error) {
            console.error("Error signing out:", error);
        } finally {
            queryClient.clear();
            navigate("/login")
        }
    }

    return (
        <ButtonPress
            type="submit"
            className={clsx(`btn btn-error w-full ${className}`)}
            onClick={() => { handleSignout() }}
        >
            <FontAwesomeIcon icon={faRightFromBracket as IconProp} /> Sign Out
        </ButtonPress>
    );
}

export default SignOutButton;