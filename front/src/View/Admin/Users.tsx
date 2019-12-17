import React, {ReactNode} from 'react';
import User from "./User";

interface UsersProps {
    id: string,
    users: any,
    className: string,
    toggleWriteRights: (event: React.ChangeEvent<HTMLInputElement>) => void,
    delete: (event: React.MouseEvent<HTMLImageElement, MouseEvent>) => void,
}

class Users extends React.Component<UsersProps, any> {
    public constructor(props: UsersProps) {
        super(props);
        this.renderUsers = this.renderUsers.bind(this);
    }

    public renderUsers(): ReactNode {
        if (undefined === this.props.users['message']) {
            let res = this.props.users.map((user: any) =>
                <User
                    id={user['id_user']}
                    key={user['id_user']}
                    pseudo={user['pseudo']}
                    writeRight={user['write_right'] === '1' ? true : false}
                    icon={user['user_icon']}
                    delete={this.props.delete}
                    toggleWriteRights={this.props.toggleWriteRights}
                />
            );
            return res;
        } else {
            return [];
        }
    }

    public render(): ReactNode {
        return (
            <div className={'users-section ' + this.props.className}>
                {this.renderUsers()}
            </div>
        );
    }
}

export default Users;
