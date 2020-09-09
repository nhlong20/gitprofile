const apiURL = 'https://api.github.com/users/';
const main = document.querySelector('#main');
const form = document.querySelector('#form');
const search = document.getElementById('search');
const getUser = async username => {
    const res = await fetch(apiURL + username);
    const resData = await res.json();
    if (resData.message == 'Not Found') {
        createErrorCard();
        return;
    }
    createUserCard(resData);
    getRepos(username);
};
function createErrorCard() {
    const cardHTML = `
    <div class="card-error">
        <div class="not-found">
          <h4>Oops</h4>
          <h1 id="e404">404</h1>
          <p>The user you are looking for might not exist!</p>
        </div>
        <div class="user-info">
             
        </div>
   </div>
    `;
    main.innerHTML = cardHTML;
}
async function getRepos(username) {
    let pageNum = 1;
    const reposPerPage = 100;
    let reposArr = [];
    let res = await fetch(
        apiURL + username + `/repos?per_page=${reposPerPage}&page=${pageNum}`
    );
    let resData = await res.json();
    reposArr = [...reposArr, ...resData];
    while (resData.length === reposPerPage) {
        pageNum++;
        res = await fetch(
            apiURL +
                username +
                `/repos?per_page=${reposPerPage}&page=${pageNum}`
        );
        resData = await res.json();
        reposArr = [...reposArr, ...resData];
    }
    addReposToCard(reposArr);
}
function createUserCard(user) {
    if (!user.bio) user.bio = '';
    const cardHTML = `
    <div class="card">
        <div>
          <img class="avatar" src="${user.avatar_url}" alt="">
        </div>
        <div class="user-info">
             <h2>${user.name}</h2>
             <p>${user.bio}</p>
             <ul class="info">
                <li>${user.followers}<strong>Followers</strong></li>
                <li>${user.following}<strong>Following</strong></li>
                <li>${user.public_repos}<strong>Repository</strong></li>
              </ul>
              <h5>My repository </h5>
              <ul class="repos-container" id="repos">

              </ul>
              <h5>Fork repository </h5>
              <ul class="repos-container" id="repos-fork">

              </ul>
        </div>
   </div>
    `;
    main.innerHTML = cardHTML;
}
function addReposToCard(repos) {
    const reposEl = document.getElementById('repos');
    const reposFork = document.getElementById('repos-fork');
    if (!Array.isArray(repos)) return;
    repos.forEach(repo => {
        const repoTag = document.createElement('a');
        repoTag.classList.add('repos');
        repoTag.href = repo.html_url;
        repoTag.innerText = repo.name;
        if (!repo.fork) {
            reposEl.appendChild(repoTag);
        } else {
            reposFork.appendChild(repoTag);
        }
    });
}
form.addEventListener('submit', e => {
    e.preventDefault();
    const user = search.value;
    if (user) {
        getUser(user);
        search.value = '';
    }
});
