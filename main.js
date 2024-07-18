const albumNameBox = document.getElementById("albumNameBox");
const artistNameBox = document.getElementById("artistNameBox");
const releaseYearBox = document.getElementById("releaseYearBox");
const genreBox = document.getElementById("genreBox");
const scoreBox = document.getElementById("scoreBox");

let allAlbums = [];

function addNewAlbum() {
    if (!validation()) return;
    const albumName = albumNameBox.value;
    const artistName = artistNameBox.value;
    const genre = genreBox.value;
    const releaseYear = +releaseYearBox.value;
    const score = +scoreBox.value;

    const album = { artistName, albumName, releaseYear, genre, score };

    allAlbums.push(album);
    dynamicTable(allAlbums);
    saveAlbums();
}

function dynamicTable(allAlbums) {
    let html = `<table class="table table-bordered table-striped">
    <thead class="thead-dark">
    <tr>
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
        <td>${allAlbums[i].artistName}</td>
        <td>${allAlbums[i].albumName}</td>
        <td>${allAlbums[i].releaseYear}</td>
        <td>${allAlbums[i].genre}</td>
        <td>${allAlbums[i].score}</td>
        <td><button class="btn btn-danger" onclick="deleteAlbum(${i})">Delete</button></td>
        <td><button class="btn btn-primary btn-block" onclick="editAlbum(${i})">Edit</button></td>
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
    const album = allAlbums[index];
    albumNameBox.value = album.albumName;
    artistNameBox.value = album.artistName;
    releaseYearBox.value = album.releaseYear;
    genreBox.value = album.genre;
    scoreBox.value = album.score;

    document.getElementById("saveEditButton").setAttribute("onclick", `saveEdit(${index})`);
    document.getElementById("editForm").style.display = "block";
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
