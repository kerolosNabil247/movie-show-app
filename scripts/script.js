const APIKEY = '51b70285';
const moviesContainer = document.getElementById('moviesContainer');
const movieSection = document.getElementById('movieSection');
const showsContainer = document.getElementById('showsContainer');
const showSection = document.getElementById('showSection');
let newElement;
let searchingValue;
let searching = document.getElementById('search');
searching.addEventListener("keypress",function(e){
    if(e.key == 'Enter'){
        // for prevent the relod of the page due to the behavior of the form that contain the search
        e.preventDefault();
        searchingValue = searching.value;
        fetchMovieAndShow(searchingValue);
    }
})



// fetch function
function fetchMovieAndShow(title){
    fetch(`http://www.omdbapi.com/?s=${encodeURIComponent(title)}&apikey=${APIKEY}`)
    .then(response => response.json())
    .then(data => { // it return Search => list of the movies or shows
        
        // clearing the movie and show containers to hold the new cards
        moviesContainer.innerHTML = '';
        showsContainer.innerHTML = '';

        // iterate on the list of the results and make cards 
        data.Search.forEach(element => {

            // create div to hold the movie card
            newElement = document.createElement('div');
            newElement.classList.add('col-lg-3','col-md-6','mb-3','main-card');

            // create the img of the movie and append it to the movie card
            let img = document.createElement('img');
            img.src = element.Poster;
            img.classList.add('mb-2','img-fluid');
            newElement.appendChild(img);

            // create the title of the movie
            let elemnetTitle = document.createElement('h6');
            let h6Text;
            // check the type to know what to write film or show
            if(element.Type == 'movie'){
                h6Text = document.createTextNode(`Film: ${element.Title}`);
            }else{
                h6Text = document.createTextNode(`Show: ${element.Title}`);
            }

            //Append it to the movie card
            elemnetTitle.classList.add('text-white');
            elemnetTitle.appendChild(h6Text)
            newElement.appendChild(elemnetTitle);

            // create the year of the movie and append it to the movie card
            let elemnetYear = document.createElement('p');
            let yearText = document.createTextNode(`${element.Year}`);
            elemnetYear.classList.add('text-white');
            elemnetYear.appendChild(yearText);
            newElement.appendChild(elemnetYear);

            //create the rate of the movie and 
            let elementRate = document.createElement('small');
            let rateText ;
            /* fetch the api with the title we get from the main fetch 
            so we cant get the rate of the movie with this title */
            fetch(`http://www.omdbapi.com/?t=${encodeURIComponent(element.Title)}&apikey=${APIKEY}`)
            .then(response => response.json())
            .then(data => {
                if(data.imdbRating == 'undefind'){
                    elementRate.innerHTML = '';
                }else{
                    rateText = document.createTextNode(`IMDb Rate: ${data.imdbRating}`);
                    elementRate.appendChild(rateText);
                }
            })
            .catch(error => {console.log('there is error heere')})

            // append the rate to the movie card
            newElement.appendChild(elementRate);
            

            // create both div containing the icon and the icon itself and append them
            let iconDiv = document.createElement('div');
            let icon = document.createElement('i');
            icon.classList.add('bi','bi-heart','custom-cursor-pointer');
            iconDiv.appendChild(icon);
            newElement.appendChild(iconDiv);

            // put event to the love icon when clicked to change to full-filled
            icon.addEventListener('click',function(){
                icon.classList.toggle('bi-heart');
                icon.classList.toggle('bi-heart-fill');
                icon.classList.toggle('liked');
            })

            //adding the card hover style
            newElement.classList.add('custom-card-hover');

            // append the movie or show card to movie section
            if(element.Type == "movie"){
                movieSection.classList.remove('d-none');
                moviesContainer.appendChild(newElement);
            }else{
                showSection.classList.remove('d-none');
                showsContainer.appendChild(newElement);
            }
        });
        document.getElementById('movieSection').scrollIntoView({ behavior: "smooth",block: "start" });
    })
    .catch(error =>{
        moviesContainer.innerHTML = '';
        let errorElemnet = document.createElement('p');
        let errorText = document.createTextNode(`There is no result for: ${searchingValue}`);
        errorElemnet.appendChild(errorText);
        moviesContainer.appendChild(errorElemnet);
    })
}

let favoriteContainer = document.getElementById('favoriteContainer');
let favoriteSection = document.getElementById('favoriteSection');
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('liked')) {
        console.log('it has liked class');
      // Get the full card to move (adjust if your structure differs)
        const card = e.target.closest('.main-card');
        const clonedCard = card.cloneNode(true);

        if(!favoriteContainer.contains(clonedCard)){  
            console.log('there is no card like me') 
            favoriteSection.classList.remove('d-none');
            favoriteContainer.appendChild(clonedCard);
        }else{
            console.log('there is card like me');
        }

        console.log(card);
    }
  });