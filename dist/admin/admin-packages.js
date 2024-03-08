
const alert = document.getElementById("alert");

function showAlert(e, t) {
    alert.textContent = e, alert.style.display = "block", alert.classList.add(`alert-${t}`), setTimeout(() => {
        alert.style.display = "none"
    }, 3e3)
}

function Updatetagging(e,id, i) {
    console.log(i   )
    let l = new FormData;
    l.append("id", e.getAttribute("data-id")), l.append("field", e.name), l.append("value", e.value), console.log(e.name, e.value), fetch("/admin/update-package", {
        method: "POST",
        body: l
    }).then(e => e.json()).then(t => {
        if (t.error) throw Error(`HTTP error! Status: ${t.status}`); {
            let l = document.querySelectorAll(`.${id}`)[i];
            l.textContent = e.value, alert.textContent = t.message, alert.style.display = "block", setTimeout(() => {
                alert.style.display = "none"
            }, 3e3)
        }
    }).catch(e => {
        console.log(e)
    })
}
window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        location.reload();
    }
});

function closePopup(item){
    const parent=item.parentNode;
    const grandparent=parent.parentNode;
    grandparent.classList.toggle('show')
    }


     async function showPopup(item){
        const popup=document.querySelector('.details');
        const popup_content=document.querySelector('.form-cont') || 0;
        if (popup && popup_content) {
            if (popup.contains(popup_content)) {
                popup_content.remove()
            }
        }  
        const id=item.getAttribute('data-id')

      const get_data=await  fetch(`/admin/packages/raw/${id}`)
      const result = await get_data.json();
      const filter_data=result.data;
      function filterObject(obj, keysToFilter) {
        const filteredObj = {};
        for (const key in obj) {
            if (!keysToFilter.includes(key)) {
                filteredObj[key] = obj[key];
            }
        }
        return filteredObj;
    }
     const keysToFilter=['__v','createdAt','updatedAt','_id','tag','ImageUrl','importantInfo']    
      const response= filterObject(filter_data, keysToFilter);
       console.log(response)
      const div=document.createElement('div')
      div.classList.add('form-cont')
      div.innerHTML=`
      <form action="" id="package-upload">
      <div class="mb-3 in">
          <label for="packageName">Package Name</label>
          <input type="text" name="Name" value="${response.Name}" class="form-control" id="packageName">
      </div>
      <div class="mb-3 in">
          <label for="Destinations">Destinations</label>
          <input type="text" name="Destinations" value="${response.Destinations}" class="form-control" id="Destinations">
      </div>
      <div class="mb-3 in">
          <label for="duration">Duration</label>
          <input type="text" name="Duration" value="${response.Duration}" class="form-control" id="Duration"
              placeholder="6 Days / 7 Nights">
      </div>
      <div class="mb-3 in">
          <label for="location">Loction</label>
          <input type="text" name="location" value="${response.location}"  class="form-control" id="location"
              placeholder="Enter location which will be shown in navbar">
      </div>
      <div class="mb-3 in">
          <label for="season">Season</label>
          <input type="text" name="season" value="${response.season}" class="form-control" id="season" placeholder="optional">
      </div>
      <div class="mb-3 in">
          <label for="difficulty">Difficulty</label>
          <input type="text" name="difficulty" value="${response.difficulty}" class="form-control" id="difficulty"
              placeholder="optional">
      </div>
      <div class="mb-3 in">
          <label for="pkgType">Package Type</label>
          <select name="pkgType" id="pkgType" class="form-select" value="${response.pkgType}" >
              <option value="domestic">Domestic</option>
              <option value="international">International</option>
              <option value="adventure">Adventure</option>
          </select>
      </div>
      <div class="mb-3 in">
          <label for="catagory">Package Category</label>
          <select name="catagory" value="${response.category}" class="form-select" id="catagory">
              <option value="AdventureTours">Adventure Tours</option>
              <option value="LeisureTours">Leisure Tours</option>
              <option value="AllPilgrimage">All Pilgrimage</option>
              <option value="Tours">Tours</option>
              <option value="Trekking">Trekking</option>
              <option value="Skiing">Skiing</option>
              <option value="BirdWatching"> Bird Watching</option>
              <option value="Fishing">Fishing </option>
              <option value="Rafting">Rafting</option>
              <option value="EducationalTours">Educational Tours</option>
              <option value="BudgetTours">Budget Tours</option>
              <option value="LuxuryTours">Luxury Tours </option>
              <option value="CulturalTours">Cultural Tours</option>
              <option value="GroupTours"> Group Tours</option>
              <option value="FamilyTours">Family Tours</option>
              <option value="JeepSafari"> Jeep Safari </option>
              <option value="Camping">Camping </option>
              <option value="CyclingTour"> Cycling Tour</option>
              <option value="BikeTour">Bike Tour</option>
              <option value="CarRentals"> Car Rentals</option>
              <option value="BusorCoachBookings"> Bus or Coach Bookings</option>
              <option value="Houseboat">Houseboat</option>
              <option value="Hotels">Hotels </option>
              <option value="Resorts">Resorts </option>
              <option value="Huts">Huts </option>
              <option value="MonumentalTours"> Monumental Tours</option>
              <option value="NationalParkTour">National Park Tour</option>
              <option value="Boating">Boating</option>
              <option value="Medical Tourism">Medical Tourism</option>


          </select>
      </div>
      <div class="mb-3 in" id="itenary">
      <label >Itenary</label>
          ${response.tourInfo.map((item, i) => {
            if (item && item.heading && item.description) {
                return `<div class="position-relative itenary-container mb-3">
                            <h3>Point-${i+1}</h3>
                            <input type="text" name="heading" class="form-control mb-3 bg-light" value="${item.heading}" data-index="${i}" id="input-itinerary-${i}" placeholder="Heading">
                            <textarea class="form-control" name="description" id="text-itenary-${i}" data-index="${i}" placeholder="Description">${item.description}</textarea>
                        </div>`;
            } else {    
            return ''; 
            }
        }).join('')}
        
  
      </div>
      <div class="mb-3 in">
          <label for="about">Place Info</label>
          <textarea type="text" name="about" class="form-control" id="about"
              placeholder="Enter About Place">         ${response.about}               </textarea>

      </div>
      <div class="mb-3 in">
          <label for="advisor">Advisor Name</label>
          <input type="text" value="${response.advisor}"  name="advisor" class="form-control" id="advisor"
              placeholder="Domestic/International/Adventure">
      </div>
      <button type="submit" disabled id="btn-submit" class="btn btn-primary mb-3">Update Package</button>
  </form>
      `
   
      popup.appendChild(div)
    const input=document.getElementById('Destinations')
    new Tagify(input)
    if(!response.error){
            const popup=document.querySelector('.popup')
        popup.classList.toggle('show')
    }else{
        alert('Error opening update package details')
    }

    document.querySelectorAll('input, select,textarea').forEach(input => {
        input.addEventListener('input',(e)=>{
            let changesArr=[];
    
         if(e.target.name==='description'|| e.target.name==='heading'){
             
            changesArr.push({feild:e.target.name, index:e.target.getAttribute('data-index')})
         }
         else if(e.target.name==='Destinations'){
            console.log('des eus')
         }
         console.log(changesArr)
        });
    });

     }
