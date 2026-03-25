window.onload = ()=>{
    fetchPlans()
}

const createPlan = async (e)=>{
    try {
        e.preventDefault()
        const form = e.target
        const data = {
            name: form[0].value,
            storage: Number(form[1].value)*1000*1000,
            price: form[2].value
        }
        await axios.post('/api/plan', data)
        window.location = location.href
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

const fetchPlans = async ()=>{
    try {
        const {data} = await axios.get('/api/plan')
        const plans = document.getElementById("plans")

        for(let item of data)
        {
            const ui = `
                <div class="bg-white rounded-lg p-4 h-fit">
                    <h1 class="text-2xl font-medium capitalize">${item.name}</h1>
                    <h1 class="text-5xl font-bold">₹${item.price.toLocaleString()}</h1>
                    <h1 class="text-gray-600 text-xl font-medium mt-3">${getMb(item.storage)}Mb</h1>
                </div>
            `
            plans.innerHTML += ui
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