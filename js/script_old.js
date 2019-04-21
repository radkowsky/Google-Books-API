// document.addEventListener('DOMContentLoaded', ()=>{})



//variables for book description
const bookInfo = {
    img: "",
    title:"",
    author: "",
    desc: "",
    link: ""
}
let indexCounter = 0;

//get data from API function
const getData = (type="GET", url, searchInput, sortBy, limit)=> {
    console.log(url)
    const xhr = new XMLHttpRequest();
    xhr.open(type, url, true);

    xhr.addEventListener("load", ()=>{
        console.log(xhr)
        if(xhr.readyState === 4 && xhr.status===200){
            const result = JSON.parse(xhr.response);
            console.log(result)
            // console.log(result.items.volumeInfo.imageLinks)
            processData(result.items);
        }
        else {
            console.log(xhr.status);
        }
    })

    xhr.addEventListener('error', ()=> {
        console.log(xhr.statusText)
    })

    xhr.send();
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

//short describe function
const cutDescr = (text,startIndex)=> {
    const indexCut = text.indexOf(" ", startIndex);
    if(text ==="undefined") return `Brak opisu`
    else if(indexCut === -1) return text
    return text.substring(0,indexCut);

}

//processing data from API
const processData = (data)=>{
    data.forEach((item)=> {
        const description = cutDescr(`${item.volumeInfo.description}`,100);
        const imgSrc = `${item.volumeInfo.imageLinks.thumbnail}`;
        bookInfo.img =  imgSrc;
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

        document.querySelector("#results").innerHTML += bookWrapper

    })
}


//submit form listener
document.getElementById('search-form').addEventListener('submit', (e)=> {
    e.preventDefault();
    //get input
    const searchInput = document.getElementById('searchInput').value;

    //get sort by
const sortBy = document.querySelector('input[name=sortby]:checked').value

    //get limit
const limit = document.getElementById('limit').value;

    //url
    const url=`https://www.googleapis.com/books/v1/volumes?q="${searchInput}"&&orderBy=${sortBy}&&maxResults=${limit}&&startIndex=0`;

    if(searchInput.value === ""){
        showMsg("Please add title of a book", "alert-danger");
        return
    }

    getData("GET",url,searchInput, sortBy,limit);

    // document.getElementById('searchInput').value = '';
    document.querySelector("#results").innerHTML = ''
})


//load more data function
loadMoreContent = () => {
    //get input
    const searchInput = document.getElementById('searchInput').value;
    //get sort by
    const sortBy = document.querySelector('input[name=sortby]:checked').value
    //get limit
    const limit = document.getElementById('limit').value;
    const scrolled = Math.ceil(window.scrollY);
    const scrollable = document.documentElement.scrollHeight-window.innerHeight;


    //url


    if(scrolled === scrollable){
        indexCounter += Number(limit);
        console.log(typeof indexCounter)
        console.log(`osiągnałeś dół storny, ładujemy dodatkowe dane`)
        const url=`https://www.googleapis.com/books/v1/volumes?q="dan brown"&&orderBy=${sortBy}&&maxResults=${limit}&&startIndex=${indexCounter}`;

        const xhr = new XMLHttpRequest();
        xhr.open("GET", url)
        xhr.addEventListener("load", ()=>{
            if(xhr.readyState === 4 && xhr.status===200){
                const result = JSON.parse(xhr.response);
                // console.log(result.items.volumeInfo.imageLinks)
                processData(result.items);
            }
            else {
                console.log(xhr.statusText);
            }
        })

        xhr.addEventListener('error', ()=> {
            console.log(xhr.statusText)
        })

        xhr.send();

        }
    }
window.addEventListener('scroll', loadMoreContent)


