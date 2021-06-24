var searchbutton =document.getElementById('search-btn')
var searchinput= document.getElementById('input-search')
var searchdetail =document.getElementById('search-detail')
var outputfav=document.getElementById('outputfav')
var fav=document.getElementById('fav')
var detaillist=document.getElementById('detaillist')
var backtofav=document.getElementById('backtofav')
var home=document.getElementById('home')


function createData(index){
    let div =document.createElement("div")
    div.classList.add('card')
    div.setAttribute('id','detail')
    div.setAttribute('style','width: 18rem;')
    div.addEventListener('dblclick',(event)=>{
        addfav(index)
        refrech()
    })
    let img = document.createElement('img')
    img.setAttribute('src',index.image_url)
    let div2=document.createElement("div")
    div2.classList.add('card-body')
    let p=document.createElement("p")
    p.classList.add('card-text')
    p.innerHTML=index.synopsis
    div2.appendChild(p)
    div.appendChild(img)
    div.appendChild(div2)
    searchdetail.appendChild(div)
}
function onLoad() {
	hideAll()
}
document.getElementById('search-btn').addEventListener('click',(event)=>{
    searchdetail.style.display='flex';
    var name =searchinput.value;
    fetch(`https://api.jikan.moe/v3/search/anime?q=${name}`)
	.then((response) => {
		return response.json()
	}).then(data => {
		for(index of data.results){
            createData(index)
        }
	})
})
function hideAll(){
    searchdetail.style.display='none';
    
}
function addfav(index){
    let nameani = {
        id:632110355,
        movie:{
            url:index.url,
            image_url:index.image_url,
            title:index.title,
            synopsis:index.synopsis,
            type:index.type,
            episodes:index.episodes,
            score:index.score,
            rated:index.rate
        }
    }
    addanitoDB(nameani);
}
function addanitoDB(index){
    fetch('https://se104-project-backend.du.r.appspot.com/movies',{
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(index)
    }).then(response =>{
        if(response.status === 200){
            return response.json()
        }else{
            throw Error(response.statusText)
        }
    }).then(data =>{
        hideAll()
        console.log('success')
    })
}
function refrech(){
    fetch('https://se104-project-backend.du.r.appspot.com/movies/632110355')
	.then((response) => {
		return response.json()
	}).then(data => {
		for(index of data){
            createfav(index)
        }
	})
}
//--- สร้างรายการที่ชอบ


function createfav(index){
    let div =document.createElement("div")
    div.classList.add('card')
    div.setAttribute('style','width: 18rem;')
    let img = document.createElement('img')
    img.setAttribute('src',index.image_url)
    let div2=document.createElement("div")
    div2.classList.add('card-body')
    let p=document.createElement("p")
    p.classList.add('card-text')
    p.innerHTML=index.synopsis
    let button=document.createElement('button')
    button.classList.add('btn-danger')
    button.setAttribute('type','button')
    button.innerText = 'detail'
    button.addEventListener('click',function() {
        outputfav.style.display='none';
        detail(index.id)
        }
    ) 
    let buttondelete=document.createElement('button')
    buttondelete.classList.add('btn-danger')
    buttondelete.setAttribute('type','button')
    buttondelete.innerText = 'delete'
    buttondelete.addEventListener('click',function() {
        let confirms = confirm(`ท่านต้องการลบหรือไม่`)
        if (confirms){
        deleteani(index.id)
        }
    })
    div2.appendChild(p)
    div2.appendChild(button)
    div2.appendChild(buttondelete)
    div.appendChild(img)
    div.appendChild(div2)
    outputfav.appendChild(div)
}

function deleteani (id) {
    fetch(`https://se104-project-backend.du.r.appspot.com/movie?id=632110355&&movieId=${id}`,{
         method: 'DELETE' 
    }).then(response => { 
        if (response.status === 200)
        { 
            return response.json() 
        }else{
             throw Error(response.statusText) }
    }).then(data =>
            { alert(`Anime is now deleted`) 
            outputfav.innerHTML="";
            refrech()
            
    }).catch( error => 
            { alert('no have anime on data base') 
    })
}
function detail(id){
    fetch(`https://se104-project-backend.du.r.appspot.com/movie/632110355/${id}`)
    .then(response => { 
        if (response.status === 200)
        { 
            return response.json() 
        }else{
             throw Error(response.statusText) }
    }).then(data =>
            { hideAll()
            detaillist.style.display='';
            document.getElementById('nameid').innerHTML=data.title
            document.getElementById('type').innerHTML=data.type
            document.getElementById('episodesdetail').innerHTML=data.episodes
            document.getElementById('scoredetail').innerHTML=data.score
            document.getElementById('imgdetail').src=data.image_url
            
    }).catch( error => 
            { alert('no have anime on data base') 
    })
}

fav.addEventListener('click',function(){
    hideAll()
    outputfav.innerHTML="";
    outputfav.style.display='flex';
    refrech()
   
})
backtofav.addEventListener('click',()=>{
    detaillist.style.display='none';
    outputfav.style.display='flex'; 
})
home.addEventListener('click',()=>{
    hideAll()
    outputfav.style.display='none';
    detaillist.style.display='none';
})
