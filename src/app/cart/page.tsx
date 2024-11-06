import dynamic from 'next/dynamic';

const Cart = dynamic(() => import('../components/Cart'), {
    loading: () => <p>Loading cart...</p>
});

export default function CartPage() {
    return(
        <Cart/>
    )
}