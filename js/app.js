// Elements
const grindSizeEl = document.getElementById('grindSize');
const grindSizeValueEl = document.getElementById('grindSizeValue');
const coffeeSelectEl = document.getElementById('coffeeSelect');
const addCoffeeBtn = document.getElementById('addCoffeeBtn');
const doseWeightEl = document.getElementById('doseWeight');
const brewTimeEl = document.getElementById('brewTime');
const finalWeightEl = document.getElementById('finalWeight');
const starsEl = document.querySelectorAll('.star');
const notesEl = document.getElementById('notes');
const saveBrewBtn = document.getElementById('saveBrew');
const brewListEl = document.getElementById('brewList');
const sortByEl = document.getElementById('sortBy');

// Modal Elements
const coffeeModal = document.getElementById('coffeeModal');
const newCoffeeNameEl = document.getElementById('newCoffeeName');
const newCoffeeRoasterEl = document.getElementById('newCoffeeRoaster');
const saveNewCoffeeBtn = document.getElementById('saveNewCoffee');
const cancelAddCoffeeBtn = document.getElementById('cancelAddCoffee');

// App State
let currentRating = 0;
let brews = JSON.parse(localStorage.getItem('brews') || '[]');
let coffees = JSON.parse(localStorage.getItem('coffees') || '[]');

// Initialize with default coffees if none exist
if (coffees.length === 0) {
    coffees = [
        { id: 1, name: 'Ethiopia Yirgacheffe', roaster: 'Stumptown' },
        { id: 2, name: 'Colombia Huila', roaster: 'Counter Culture' },
        { id: 3, name: 'Brazil Cerrado', roaster: 'Blue Bottle' }
    ];
    localStorage.setItem('coffees', JSON.stringify(coffees));
}

// Event Listeners
grindSizeEl.addEventListener('input', () => {
    grindSizeValueEl.textContent = grindSizeEl.value;
});

starsEl.forEach(star => {
    star.addEventListener('click', () => {
        const value = parseInt(star.getAttribute('data-value'));
        setRating(value);
    });
});

saveBrewBtn.addEventListener('click', saveBrew);

// Coffee Modal Events
addCoffeeBtn.addEventListener('click', showAddCoffeeModal);
cancelAddCoffeeBtn.addEventListener('click', hideAddCoffeeModal);
saveNewCoffeeBtn.addEventListener('click', addNewCoffee);

// Sorting Events
sortByEl.addEventListener('change', () => {
    sortBrews(sortByEl.value);
});

// Functions
function setRating(rating) {
    currentRating = rating;
    
    starsEl.forEach(star => {
        const value = parseInt(star.getAttribute('data-value'));
        if (value <= rating) {
            star.textContent = '★';
            star.classList.add('selected');
        } else {
            star.textContent = '☆';
            star.classList.remove('selected');
        }
    });
}

function saveBrew() {
    // Get selected coffee
    const coffeeId = parseInt(coffeeSelectEl.value);
    const selectedCoffee = coffees.find(c => c.id === coffeeId);
    
    const brew = {
        id: Date.now(),
        date: new Date().toISOString(),
        coffee: selectedCoffee,
        grindSize: parseInt(grindSizeEl.value),
        doseWeight: parseFloat(doseWeightEl.value),
        brewTime: parseInt(brewTimeEl.value),
        finalWeight: parseFloat(finalWeightEl.value),
        ratio: calculateRatio(parseFloat(finalWeightEl.value), parseFloat(doseWeightEl.value)),
        rating: currentRating,
        notes: notesEl.value.trim()
    };
    
    brews.unshift(brew);
    localStorage.setItem('brews', JSON.stringify(brews));
    
    resetForm();
    renderBrewList();
}

function calculateRatio(output, input) {
    return (output / input).toFixed(1);
}

function resetForm() {
    // Keep the coffee selection as is
    grindSizeEl.value = 10;
    grindSizeValueEl.textContent = 10;
    doseWeightEl.value = 18;
    brewTimeEl.value = 25;
    finalWeightEl.value = 36;
    notesEl.value = '';
    setRating(0);
}

function sortBrews(sortType) {
    const sortedBrews = [...brews];
    
    switch (sortType) {
        case 'date':
            // Already sorted by date (most recent first)
            break;
        case 'rating':
            sortedBrews.sort((a, b) => b.rating - a.rating);
            break;
        case 'coffee':
            sortedBrews.sort((a, b) => {
                const coffeeNameA = a.coffee ? a.coffee.name.toLowerCase() : 'z';
                const coffeeNameB = b.coffee ? b.coffee.name.toLowerCase() : 'z';
                return coffeeNameA.localeCompare(coffeeNameB);
            });
            break;
    }
    
    renderBrewList(sortedBrews);
}

function renderBrewList(brewsToRender = brews) {
    brewListEl.innerHTML = '';
    
    if (brewsToRender.length === 0) {
        brewListEl.innerHTML = '<p>No brews saved yet.</p>';
        return;
    }
    
    brewsToRender.forEach(brew => {
        const brewCard = document.createElement('div');
        brewCard.classList.add('brew-card');
        
        const date = new Date(brew.date);
        const formattedDate = `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
        
        const ratingStars = '★'.repeat(brew.rating) + '☆'.repeat(5 - brew.rating);
        
        brewCard.innerHTML = `
            <div class="brew-card-header">
                <span class="brew-date">${formattedDate}</span>
                <span class="brew-rating">${ratingStars}</span>
            </div>
            <div class="brew-coffee">
                <strong>${brew.coffee ? brew.coffee.name : 'Unknown Coffee'}</strong>
                ${brew.coffee && brew.coffee.roaster ? ` - ${brew.coffee.roaster}` : ''}
            </div>
            <div class="brew-details">
                <div class="brew-detail"><strong>Grind Size:</strong> ${brew.grindSize}</div>
                <div class="brew-detail"><strong>Dose:</strong> ${brew.doseWeight}g</div>
                <div class="brew-detail"><strong>Brew Time:</strong> ${brew.brewTime}s</div>
                <div class="brew-detail"><strong>Output:</strong> ${brew.finalWeight}g</div>
                <div class="brew-detail"><strong>Ratio:</strong> 1:${brew.ratio}</div>
            </div>
            ${brew.notes ? `<div class="brew-notes">${brew.notes}</div>` : ''}
            <button class="delete-brew" data-id="${brew.id}">Delete</button>
        `;
        
        const deleteBtn = brewCard.querySelector('.delete-brew');
        deleteBtn.addEventListener('click', () => deleteBrew(brew.id));
        
        brewListEl.appendChild(brewCard);
    });
}

function deleteBrew(id) {
    brews = brews.filter(brew => brew.id !== id);
    localStorage.setItem('brews', JSON.stringify(brews));
    
    // Apply current sort when re-rendering
    if (sortByEl.value !== 'date') {
        sortBrews(sortByEl.value);
    } else {
        renderBrewList();
    }
}

// Coffee Modal Functions
function showAddCoffeeModal() {
    newCoffeeNameEl.value = '';
    newCoffeeRoasterEl.value = '';
    coffeeModal.classList.add('show');
}

function hideAddCoffeeModal() {
    coffeeModal.classList.remove('show');
}

function addNewCoffee() {
    const coffeeName = newCoffeeNameEl.value.trim();
    
    if (!coffeeName) {
        alert('Please enter a coffee name');
        return;
    }
    
    const newCoffee = {
        id: Date.now(),
        name: coffeeName,
        roaster: newCoffeeRoasterEl.value.trim()
    };
    
    coffees.push(newCoffee);
    localStorage.setItem('coffees', JSON.stringify(coffees));
    
    // Add the new coffee to the select and select it
    populateCoffeeSelect();
    coffeeSelectEl.value = newCoffee.id;
    
    hideAddCoffeeModal();
}

function populateCoffeeSelect() {
    coffeeSelectEl.innerHTML = '';
    
    coffees.forEach(coffee => {
        const option = document.createElement('option');
        option.value = coffee.id;
        option.textContent = coffee.roaster 
            ? `${coffee.name} - ${coffee.roaster}` 
            : coffee.name;
        coffeeSelectEl.appendChild(option);
    });
}

// Initialize
populateCoffeeSelect();
renderBrewList();