const albumNameBox = document.getElementById("albumNameBox");
const artistNameBox = document.getElementById("artistNameBox");
const releaseYearBox = document.getElementById("releaseYearBox");
const genreBox = document.getElementById("genreBox");
const scoreBox = document.getElementById("scoreBox");

const apiKey = "1073c46f5c1453cc6c175d230afd704f"; //Last.fm Key for the auto album cover

let allAlbums = [];

async function addNewAlbum() {
    if (!validation()) return;
    const albumName = albumNameBox.value;
    const artistName = artistNameBox.value;
    const genre = genreBox.value;
    const releaseYear = +releaseYearBox.value;
    const score = +scoreBox.value;

    const photoUrl = await fetchAlbumCover(artistName, albumName);

    const album = { artistName, albumName, releaseYear, genre, score, photoUrl };

    allAlbums.push(album);
    dynamicTable(allAlbums);
    saveAlbums();
}


function dynamicTable(allAlbums) {
    let html = `<table class="roboto-regular">
    <thead>
    <tr>
    <th>Album Cover</th>
    <th>Artist Name</th>
    <th>Album Name</th>
    <th>Year</th>
    <th>Genre</th>
    <th>Score</th>
    <th>Delete</th>
    <th>Edit</th>
    </tr>
    </thead>
    <tbody>`;
    for (let i = 0; i < allAlbums.length; i++) {
        html += `
            <tr>
            <td><img class="album-cover" src="${allAlbums[i].photoUrl}" alt="${allAlbums[i].albumName}"></td>
        <td>${allAlbums[i].artistName}</td>
        <td>${allAlbums[i].albumName}</td>
        <td>${allAlbums[i].releaseYear}</td>
        <td>${allAlbums[i].genre}</td>
        <td>${allAlbums[i].score}</td>
        <td><button class="" title="Delete Entry" onclick="deleteAlbum(${i})"><img src="assets/trash.svg"></button></td>
        <td><button class="" title="Edit Entry" onclick="editAlbum(${i})"><img src="assets/pen.svg"></button></td>
        </tr>`;
    }
    html += `<tbody></table>`;
    containerDiv.innerHTML = html;
}


function deleteAlbum(index) {
    const sure = confirm(`Are you sure you want to delete the album?`);
    if (!sure) return;
    allAlbums.splice(index, 1);
    dynamicTable(allAlbums);

    saveAlbums();
}

function saveAlbums() {
    const json = JSON.stringify(allAlbums);
    localStorage.setItem("allAlbums", json);
}

function loadAlbums() {
    const json = localStorage.getItem("allAlbums");
    if (!json) return;
    allAlbums = JSON.parse(json);
    dynamicTable(allAlbums);
}

function editAlbum(index) {
    const sure = confirm("Are you sure you want to edit the album details?");
    if(!sure) return;
    const album = allAlbums[index];
    albumNameBox.value = album.albumName;
    artistNameBox.value = album.artistName;
    releaseYearBox.value = album.releaseYear;
    genreBox.value = album.genre;
    scoreBox.value = album.score;
    allAlbums.splice(index, 1);
    dynamicTable(allAlbums);

    saveAlbums();
}

function validation() {
    if (!artistNameBox.value) {
        alert("Artist Name Missing!");
        artistNameBox.focus();
        return false;
    }
    if (!albumNameBox.value) {
        alert("Album Name Missing!");
        albumNameBox.focus();
        return false;
    }
    if (!genreBox.value) {
        alert("Genre Missing!");
        genreBox.focus();
        return false;
    }
    if (!scoreBox.value) {
        alert("Score Missing!");
        scoreBox.focus();
        return false;
    }
    if (releaseYearBox < 0) {
        alert("Music Outdated!");
        releaseYearBox.focus();
        return false;
    }
    return true;
}

async function fetchAlbumCover(artist, album) {
    try {
        const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${apiKey}&artist=${artist}&album=${album}&format=json`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data.album && data.album.image && data.album.image.length > 0) {
            return data.album.image[data.album.image.length - 1]['#text'];
        } else {
            return 'default-image-url'; // A default image URL in case the API doesn't return an image
        }
    } catch (error) {
        console.error('Failed to fetch album cover:', error);
        return 'default-image-url'; // A default image URL in case of an error
    }
}


function formReset(){
    artistNameBox.value = ``;
    albumNameBox.value = ``;
    genreBox.value = ``;
    scoreBox.value = 5;
    releaseYearBox.value = ``;
}