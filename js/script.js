document.addEventListener('DOMContentLoaded', ()=>{
const form = document.querySelector('#search-form');

//variables for book description
const bookInfo = {
    img: "",
    title:"",
    author: "",
    desc: "",
    link: ""
}
let indexCounter = 0;

//load data from API
const loadData = (url)=> {
    fetch(url)
    .then(resp => {
        if(resp.ok){
            return resp.json();
        }
        else {
            return Promise.reject(resp)
        }
    }
    )
    .then(
        data=> processData(data.items)
    )
    .catch(
        err => console.log(err)
    )
}

//processing data from API
const processData = (data)=>{
    data.forEach((item)=> {
        const description = cutDescr(`${item.volumeInfo.description}`,100);
        bookInfo.img =  `${item.volumeInfo.imageLinks.thumbnail}`;
        bookInfo.title = `${item.volumeInfo.title}`;
        bookInfo.author = `${item.volumeInfo.authors}`;
        bookInfo.desc = description;
        bookInfo.link = `${item.volumeInfo.infoLink}`;

        let bookWrapper = `
        <div class="card" style="width: 33%; display: inline-block; height:300px">
            <img src="${bookInfo.img}" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title">${bookInfo.title}</h5>
                <p class="card-text">${bookInfo.desc}...</p>
                <a href="${bookInfo.link}" class="btn btn-primary" target="_blank">Check more</a>
            </div>
        </div>`;

        document.querySelector("#results").innerHTML += bookWrapper;

    })
}

//short describe function
const cutDescr = (text,startIndex)=> {
    const indexCut = text.indexOf(" ", startIndex);
    if(text ==="undefined") return `Brak opisu`;
    else if(indexCut === -1) return text;
    return text.substring(0,indexCut);

}

//additional protection for required attribute in HTML5
const showMsg = (text,className)=>{
    const div = document.createElement('div');
    div.className = `alert ${className}`;
    div.textContent = text;
    //get parent
    const parent = document.getElementById('search-container');
    const elBefore = document.getElementById('search');
    parent.insertBefore(div,elBefore);

    setTimeout(()=>{
        document.querySelector(`.${className}`).remove();
    },3000)
}

form.addEventListener('submit',(e)=> {
    e.preventDefault();
    //get searchinput
    const searchInput = document.querySelector('#searchInput').value;
    //get sortby
    const sortBy = document.querySelector('input[name="sortby"]:checked').value;
    //get limit
    const limit = document.querySelector('#limit').value;
    if(searchInput.trim() ==""){
        showMsg("Please add title of a book", "alert-danger");
        return;
    }
    const url = `https://www.googleapis.com/books/v1/volumes?q="${searchInput}"&&orderBy=${sortBy}&&maxResults=${limit}&&startIndex=0`;
    loadData(url);
})

// //load more data function
loadMoreContent = () => {
    //get input
    const searchInput = document.getElementById('searchInput').value;
    //get sort by
    const sortBy = document.querySelector('input[name=sortby]:checked').value;
    //get limit
    const limit = document.getElementById('limit').value;
    const scrolled = Math.ceil(window.scrollY);
    const scrollable = document.documentElement.scrollHeight-window.innerHeight;

    if(scrolled === scrollable){
        indexCounter += Number(limit);
        const url=`https://www.googleapis.com/books/v1/volumes?q="${searchInput}"&&orderBy=${sortBy}&&maxResults=${limit}&&startIndex=${indexCounter++}`;
        loadData(url);
        }
    }
window.addEventListener('scroll', loadMoreContent)
});



