let req = new XMLHttpRequest();
let usersCount = 0;
let users = [];

req.open('GET', `https://api.randomuser.me/1.0/?results=50&nat=gb,us&inc=gender,name,location,email,phone,picture`);
req.send();

function User(info) {
    this.id = usersCount++;
    this.name = {
        title: info.name.title,
        first: info.name.first,
        last: info.name.last
    };
    this.location = {
        street: info.location.street,
        city: info.location.city,
        state: info.location.state
    };
    this.email = info.email;
    this.phone = info.phone;
    this.picture = {
        large: info.picture.large,
        medium: info.picture.medium
    };

    this.create = function () {
        let element = document.getElementById('users');
        let userCard = document.createElement('div');
        userCard.setAttribute('class', 'user');
        userCard.setAttribute('id', `user${this.id}`);
        userCard.setAttribute('onclick', `showFullInfo(${this.id})`);
        let userImg = document.createElement('img');
        userImg.setAttribute('src', `${this.picture.medium}`);
        let userName = document.createElement('h3');
        userName.innerHTML = `${this.name.title}. ${this.name.first} ${this.name.last}`;
        userCard.appendChild(userImg);
        userCard.appendChild(userName);
        element.appendChild(userCard);
    }

    showFullInfo = function (id) {
        let element = document.getElementById('userInfo');
        for (let i = 0; i < users.length; i++) {
            if (id === users[i].id) {
                let currentUser = users[i];
                element.innerHTML = `
                <img src="${currentUser.picture.large}" alt="${currentUser.name.title}. ${currentUser.name.first} ${currentUser.name.last}">
                <div id="userFullInfo">
                    <h2>${currentUser.name.title}. ${currentUser.name.first} ${currentUser.name.last}</h2>
                    <ul>
                        <li>Street: ${currentUser.location.street}</li>
                        <li>City: ${currentUser.location.city}</li>
                        <li>State: ${currentUser.location.state}</li>
                        <li>Email: ${currentUser.email}</li>
                        <li>Phone: ${currentUser.phone}</li>
                    </ul>
                </div>
                <button onclick="hideFullInfo()">Close</button>`;
                element.style.display = 'block';
            }
        }
    }
    hideFullInfo = function () {
        document.getElementById('userInfo').style.display = 'none';
    }

    usersSort = function () {
        element = document.getElementById('usersSort');
        let sortType = element[element.selectedIndex].value;

        if (sortType === 'alphabetReverse') {
            users.sort(function (a, b) {
                if (a.name.last < b.name.last) return 1;
                if (a.name.last > b.name.last) return -1;
                return 0;
            });
        } else {
            users.sort(function (a, b) {
                if (a.name.last < b.name.last) return -1;
                if (a.name.last > b.name.last) return 1;
                return 0;
            });
        }

        element = document.getElementById('users');
        element.innerHTML = '';

        for (let user of users) {
            user.create();
        }
    }
}

req.onload = function () {
    if (req.status != 200) {
        console.log(`Error ${req.status}`);
    }

    for (let userInfo of JSON.parse(req.response).results) {
        users.push(new User(userInfo));
    }

    usersSort();
};