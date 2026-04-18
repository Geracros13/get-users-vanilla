const container = document.getElementById('cardsContainer');
const btnAZ = document.getElementById('btnAZ');
const btnPrev = document.getElementById('btnPrev');
const btnNext = document.getElementById('btnNext');
const pageDisplay = document.getElementById('pageNumber');
const searchInput = document.getElementById('searchInput');

let allUsers = []; 
let currentPage = 0;
const limit = 9;     // Usuarios por página

async function fetchUsers(page = 0) {
    const skip = page * limit;
    const url = `https://dummyjson.com/users?limit=${limit}&skip=${skip}&select=id,firstName,lastName,username,phone,address,image`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        allUsers = data.users;
        
        btnNext.disabled = allUsers.length < limit;
        btnPrev.disabled = currentPage === 0;

        renderCards(allUsers);
        pageDisplay.innerText = `Page ${currentPage + 1}`;
    } catch (error) {
        console.error("Error:", error);
    }
}

function renderCards(usersList) {
    container.innerHTML = "";
    usersList.forEach(user => {
        const { firstName, lastName, username, phone, address, image } = user;
        const card = document.createElement('div');
        card.className = 'container-card';
        card.innerHTML = `
            <img src="${image}" alt="User" class="card-img"/>
            <div class="items-card">
                <p><strong>Name:</strong> ${firstName} ${lastName}</p>
                <p><strong>Username:</strong> ${username}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Address:</strong> ${address.address}</p>
            </div>
        `;
        container.appendChild(card);
    });
}

btnNext.addEventListener('click', () => {
    currentPage++;
    fetchUsers(currentPage);
});

btnPrev.addEventListener('click', () => {
    if (currentPage > 0) {
        currentPage--;
        fetchUsers(currentPage);
    }
});


btnAZ.addEventListener('click', () => {
    const sorted = [...allUsers].sort((a, b) => a.firstName.localeCompare(b.firstName));
    renderCards(sorted);
});

searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();

    
    const filteredUsers = allUsers.filter(user => {
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
        const username = user.username.toLowerCase();
        
        
        return fullName.includes(searchTerm) || username.includes(searchTerm);
    });

    
    renderCards(filteredUsers);
});

fetchUsers(currentPage);