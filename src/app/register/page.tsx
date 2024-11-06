import dynamic from 'next/dynamic';

const Register = dynamic(() => import('../components/Register'), {
    loading: () => <div>Loading...</div>
});

export default function RegisterPage() {
    return (
        <Register/>
    )
}