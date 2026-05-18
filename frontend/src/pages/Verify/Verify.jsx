import React, { useState } from 'react'
import { useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import PaymentSuccessModal from '../../components/PaymentSuccessModal';
import jsPDF from 'jspdf';

const Verify = () => {

    const { navigate, token, setCartItems, backendUrl, currency } = useContext(StoreContext);
    const [searchParams, setSearchParams] = useSearchParams();
    const [open, setOpen] = useState(false);
    const [order, setOrder] = useState(null); // {orderId, amount, date}

    const success = searchParams.get('success');
    const orderId = searchParams.get('orderId');

    const verifyPayment = async () => {
        
        try {
            
            if (!token) {
                return null
            } 

            const response = await axios.post(backendUrl + '/api/order/verifyStripe', {success, orderId}, {headers:{ token }})

                        if (response.data.success) {
                                setCartItems({})
                                // Fetch order details to show in modal
                                try {
                                    const res2 = await axios.post(backendUrl + '/api/order/userorders', {}, { headers: { token } });
                                    const orders = res2.data?.orders || [];
                                    const found = orders.find(o => String(o._id) === String(orderId));
                                    if (found) {
                                        setOrder({ orderId: found._id, amount: found.amount, date: found.date });
                                    } else {
                                        setOrder({ orderId, amount: undefined, date: Date.now() });
                                    }
                                } catch (e) {
                                    setOrder({ orderId, amount: undefined, date: Date.now() });
                                }
                                setOpen(true);
            }else{
                navigate('/cart')
            }

        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }

    }

    useEffect(() => {
        verifyPayment();
    }, [token])

    const onClose = () => { setOpen(false); navigate('/orders'); }

    const onDownload = () => {
        try {
            const doc = new jsPDF();
            const id = order?.orderId || orderId;
            const dt = order?.date ? new Date(order.date).toLocaleString() : new Date().toLocaleString();
            const amt = order?.amount;
            doc.setFontSize(18); doc.text('Payment Successful', 105, 20, { align: 'center' });
            doc.setFontSize(12); doc.text(`Order ID: ${id}`, 20, 40); doc.text(`Date: ${dt}`, 20, 50);
            if (amt !== undefined) { doc.setFontSize(16); doc.text(`Amount: ${currency}${Number(amt).toFixed(2)}`, 20, 70); }
            doc.text('Thank you for your purchase!', 20, 90);
            doc.save(`receipt_${id}.pdf`);
        } catch (e) { toast.error('Could not generate receipt'); }
    }

    const onPrint = () => {
        const id = order?.orderId || orderId;
        const dt = order?.date ? new Date(order.date).toLocaleString() : new Date().toLocaleString();
        const amt = order?.amount;
        const w = window.open('', '_blank');
        if (!w) return;
        w.document.write(`<!doctype html><html><head><title>Receipt</title><style>body{font-family:Arial,sans-serif;padding:24px}h1{font-size:22px;margin:0 0 12px}p{margin:6px 0}</style></head><body><h1>Payment Successful</h1><p><strong>Order ID:</strong> ${id}</p><p><strong>Date:</strong> ${dt}</p>${amt !== undefined ? `<p><strong>Amount:</strong> ${currency}${Number(amt).toFixed(2)}</p>`: ''}<p>Thank you for your purchase!</p></body></html>`);
        w.document.close(); w.focus(); w.print(); w.close();
    }

    return (
        <>
            <PaymentSuccessModal 
                open={open}
                onClose={onClose}
                amount={order?.amount !== undefined ? `${currency}${Number(order.amount).toFixed(2)}` : ''}
                orderId={order?.orderId || orderId}
                date={order?.date}
                onDownload={onDownload}
                onPrint={onPrint}
            />
        </>
    )
}

export default Verify
