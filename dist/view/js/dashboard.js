let session = null
window.onload = async ()=>{
    session = await getSession()

    if(!session)
        return window.location = "/login.html"

    profileInfo(session.user)
    fetchDashboard(session)
    fetchStorage(session.token)
}

const fetchDashboard = async (session)=>{
    try {
        const report = document.getElementById("report")
        const options = {
            headers: {
                Authorization: `Bearer ${session.token}`
            }
        }
        const {data} = await axios.get('/api/dashboard', options)

        for(let item of data)
        {
            console.log(item)
            const ui = `
                <div class="border border-gray-200 rounded-lg flex items-center justify-center flex-col py-8">
                    <i class="ri-file-3-fill text-4xl"></i>
                    <h1 class="text-lg">${item._id}</h1>
                    <h1 class="text-4xl font-bold mt-4">${getMb(item.totalSize)} Mb</h1>
                </div>
            `
            report.innerHTML += ui
        }
    }
    catch(err)
    {
        console.log(err)
    }
}

const openPlans = async ()=>{
    try {
        const drawer = document.getElementById("drawer")
        drawer.classList.remove("-right-[400px]")
        drawer.classList.add("right-0")
        const {data} = await axios.get('/api/plan')

        drawer.innerHTML = ""
        for(let item of data)
        {
            if(item.name !== "starter")
            {
                const ui = `
                    <div class="bg-white rounded-lg p-4 h-fit bg-green-400 mb-6">
                        <h1 class="text-2xl font-medium capitalize">${item.name}</h1>
                        <h1 class="text-4xl font-bold">₹${item.price.toLocaleString()}</h1>
                        <h1 class="text-gray-600 text-xl font-medium mt-3">${getMb(item.storage)}Mb</h1>
                        <button class="bg-black rounded text-white px-6 py-2 mt-3" onclick="buyNow('${item._id}', '${item.name}')">Buy</button>
                    </div>
                `
                drawer.innerHTML += ui
            }
        }
    }
    catch(err)
    {
        new Swal({
            icon: 'error',
            title: 'Failed !',
            text: err.response.data.message
        })
    }
}

const closeDrawer = ()=>{
    const drawer = document.getElementById("drawer")
    drawer.classList.remove("right-0")
    drawer.classList.add("-right-[400px]")
}

const buyNow = async (id, name)=>{
    try {
        const {data} = await axios.post('/api/razorpay/order', {planId: id})
        const options = {
            "key": "rzp_test_nMQ9pgMcmg8CtL",
            "amount": data.amount,
            "currency": "INR",
            "name": "ShareKit",
            "description": name+" - ShareKit Plan",
            "image": "https://static.vecteezy.com/system/resources/previews/023/654/784/non_2x/golden-logo-template-free-png.png",
            "order_id": data.id,
            // "callback_url": "https://google.com",
            "prefill": {
                "name": "Gaurav Kumar",
                "email": "gaurav.kumar@example.com",
                "contact": "9000090000"
            },
            "notes": {
                "user": session.user.id,
                "plan": id
            },
            "theme": {
                "color": "#3399cc"
            },
            "handler": (payment)=>{
                window.location = "/apps/dashboard.html"
            }
        };
        var rzp1 = new Razorpay(options)   
        rzp1.open()   
        
        rzp1.on('payment.failed', (payment)=>{
            window.location = "/apps/dashboard.html"
        })
    }
    catch(err)
    {
        new Swal({
            icon: 'error',
            title: 'Failed !',
            text: err.response.data.message
        })
    }
}