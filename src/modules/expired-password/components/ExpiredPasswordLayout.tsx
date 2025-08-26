import UserPasswordFormContainer from "modules/expired-password/components/ExpiredPasswordLayoutContainer";
import * as React from "react";
import styles from "./ExpiredPasswordLayout.module.scss";

interface ExpiredPasswordLayoutProps { }

const ExpiredPasswordLayout: React.FC<ExpiredPasswordLayoutProps> = ({ }) => {

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <UserPasswordFormContainer />
            </div>
        </div>
    );
};

export default ExpiredPasswordLayout;