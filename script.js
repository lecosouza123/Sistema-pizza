// função para retorna  querySelector
const dq = (el)=>document.querySelector(el) 
const dqA = (el)=>document.querySelectorAll(el)
let janelaQt = 1
let cart = []
let modalKey = 0

pizzaJson.map((item, index)=>{ // aki to pegando meu json objeto 
    let pizzaItem = dq('.models .pizza-item').cloneNode(true) 
   
    pizzaItem.setAttribute('data-key', index)// to pegando os id do pizzajson com index e addicionado um novo atributo data-key

    
    pizzaItem.querySelector('.pizza-item--img img').src = item.img
    pizzaItem.querySelector('.pizza-item--price').innerHTML
    = `R$ ${item.preci.toFixed(2)}`
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description.slice(0, 100) + '...'
    
   


    //usar e.preventDefault() impede que a ação padrão aconteça e nos permite implementar nossas próprias ações personalizadas.quando eu clica na pizza ele não vai atualizar a tela.
    pizzaItem.querySelector('a').addEventListener('click', (e)=>{
        e.preventDefault() 
        
        // pegando a informação da pizza que foi clicada
        //Usando a propriedade e.target, recuperamos o elemento no qual o evento foi acionado originalmente. O método close() localiza o ancestral mais próximo do elemento de destino que corresponde ao seletor CSS fornecido, .pizza-item neste caso.
        let key = e.target.closest('.pizza-item').getAttribute('data-key')
        janelaQt = 1
        modalKey = key
       // preencher as informações em pizzaitem no modal

       dq('.pizzaInfo h1').innerHTML = pizzaJson[key].name
       dq('.pizzaInfo--desc').innerHTML = pizzaJson[key].description.slice(0, 100) + '...' 
       dq('.pizzaInfo--actualPrice').innerHTML = `R$${pizzaJson[key].preci.toFixed(2)}`


       //vai remove selected do pissa grande essa forma junto com if dentro do lopp vai reseta modal da medidas de pizza
        dq('.pizzaInfo--size.selected').classList.remove('selected')

        dqA('.pizzaInfo--size').forEach((size, sizeIndex) =>{
            if(sizeIndex == 2){ // aki vai adicionar selected 
                size.classList.add('selected')
            }

            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex]
        })





        dq('.pizzaBig img').src = pizzaJson[key].img
     
        dq('.pizzaInfo--qt').innerHTML = janelaQt // para zera quantidade


        // aki eu vou fazer abrir janela da pizza
        dq('.pizzaWindowArea').style.opacity = 0
        dq('.pizzaWindowArea').style.display = 'flex'

        // vou da um tempo para aparecer para fazer animação
        setTimeout(()=>{
            dq('.pizzaWindowArea').style.opacity = 1
        }, 250)  

    })

    dq('.pizza-area').append(pizzaItem)
})

//evento do modal para fechar
function closeModal(){
    dq('.pizzaWindowArea').style.opacity = 0
    setTimeout(() => {
        dq('.pizzaWindowArea').style.display = 'none'
    }, 500)
}
dqA('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{// um for na lista de botttoes
    item.addEventListener('click', closeModal)
})

//botões mais e menos do modal 
dq('.pizzaInfo--qtmenos').addEventListener('click', ()=> {
    janelaQt--
    dq('.pizzaInfo--qt').innerHTML = janelaQt
    if(janelaQt < 1){
        janelaQt = 1
        dq('.pizzaInfo--qt').innerHTML = janelaQt

    }
})
dq('.pizzaInfo--qtmais').addEventListener('click', ()=> {
    janelaQt++
    dq('.pizzaInfo--qt').innerHTML = janelaQt
    
})

//seleciona botao de tamanho e não seleciona
dqA('.pizzaInfo--size').forEach((size, sizeIndex) => {
    size.addEventListener('click', (e) =>{
    dq('.pizzaInfo--size.selected').classList.remove('selected')
    size.classList.add('selected') // vou usar size para não quebrar
    })
})

dq('.pizzaInfo--addButton').addEventListener('click', () => {
    //Qual a pizza? 
    //quantas pizzas?
    // Qual tamanho ? 
    let size = parseInt(dq('.pizzaInfo--size.selected').getAttribute('data-key'))
    

    let identifier = pizzaJson[modalKey].id+'@'+size

    let key = cart.findIndex((item)=>item.identifier == identifier)

    if(key > -1){
        cart[key].qt += janelaQt
    } else {
        cart.push({
            identifier,
            id:pizzaJson[modalKey].id,
            size,
            qt:janelaQt
        })

    }    
    updateCart()
    closeModal()
})

function updateCart(){
    if(cart.length > 0){
        dq('aside').classList.add('show')
        dq('.cart').innerHTML = '' // para limpar cart

        for(let i in cart){
            let pizzaItem = pizzaJson.find((item) =>item.id == cart[i].id)
            let cartPizza = dq('.models .cart--item').cloneNode(true)

            let pizzaSizeName // para aparece tamanho no cart

            switch(cart[i].size){
                case 0:
                    pizzaSizeName = 'P'
                    break
                case 1:
                    pizzaSizeName = 'M'
                    break
                case 2:
                    pizzaSizeName = 'G'
                    break        
            }


            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`


            cartPizza.querySelector('img').src = pizzaItem.img
            cartPizza.querySelector('.cart--item-nome').innerHTML = pizzaName
            cartPizza.querySelector('.cart--item--qt').innerHTML = cart[i].qt
            cartPizza.querySelector('.cart--item-qtmenos').addEventListener('click', ()=> { 
                if(cart[i].qt > 1){
                    cart[i].qt--
                    updateCart()
                    }
    
            })
            cartPizza.querySelector('.cart--item-qtmais').addEventListener('click', ()=> {
                cart[i].qt++
                updateCart()
                
            })

            dq('.cart').append(cartPizza)
            
        }
    } else {
        dq('aside').classList.remove('show')
    }
}
