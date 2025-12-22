import React from 'react';
import UserForm from '../components/UserForm';
import styles from '../../dashboard.module.css';
import PageHeader from '../../components/PageHeader';

export default function NewUserPage() {
    return (
        <div className={styles.dashboardPage}>
            <PageHeader
                title="Add New User"
                description="Create a new team member account"
            />

            <UserForm />
        </div>
    );
}
