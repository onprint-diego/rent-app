import { api } from "../../utils/woocommerce";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

async function CreateStripeSession(req, res) {
    const { cart, customer } = req.body;

    const response = await api.get("products")
    const modemName = response.data[4].name
    const modemPrice = parseInt(response.data[4].price)
    const powerBankPrice = parseInt(response.data[0].price)
    const adapterPrice = parseInt(response.data[1].price)
    const shippingFee = parseInt(response.data[4].attributes[0].options[0])
    const subTotal = modemPrice * cart.qty

    const items = []
    // items.push({
    //     price_data: {
    //         currency: 'usd',
    //         product_data: {
    //             name: modemName,
    //         },
    //         unit_amount: subTotal * 100,
    //     },
    //     quantity: 1,
    // })

    // items.push({
    //     price_data: {
    //         currency: 'usd',
    //         product_data: {
    //             name: "Envío",
    //         },
    //         unit_amount: shippingFee * 100,
    //     },
    //     quantity: 1,
    // })

    // if(cart.adapter.is) {
    //     items.push({
    //         price_data: {
    //             currency: 'usd',
    //             product_data: {
    //                 name: "Adaptador",
    //             },
    //             unit_amount: adapterPrice * 100,
    //         },
    //         quantity: 1,
    //     })
    // }

    // if(cart.powerBank.is) {
    //     items.push({
    //         price_data: {
    //             currency: 'usd',
    //             product_data: {
    //                 name: "Power Bank",
    //             },
    //             unit_amount: powerBankPrice * 100,
    //         },
    //         quantity: 1,
    //     })
    // }

    const session = await stripe.checkout.sessions.create({
        success_url: 'https://rent-internet.com/succesful',
        cancel_url: 'https://rent-internet.com/cancel',
        mode: 'payment',
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: modemName,
                    },
                    unit_amount: subTotal * 100,
                },
                quantity: 1,
            }
        ]
        // line_items: items,
        // metadata: {
        //     customerName: customer.name,
        //     customerSurname: customer.surname,
        //     customerEmail: customer.email,
        //     customerPhone: customer.phone,
        //     deliveryAddress: customer.deliveryAddress,
        //     deliveryCp: customer.deliveryCp,
        //     deliveryCity: customer.deliveryCity,
        //     deliveryCountry: customer.deliveryCountry,
        //     billingAddress: customer.billingAddress,
        //     billingCp: customer.billingCp,
        //     billingCity: customer.billingCity,
        //     billingCountry: customer.billingCountry,
        // }
    });

    res.json({ id: session.id })
}

export default CreateStripeSession