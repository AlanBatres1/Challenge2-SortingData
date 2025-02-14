const filterDropdownButton = document.getElementById('filterDropdownButton');
const filterDropdown = document.getElementById('filterDropdown');
const sortById = document.getElementById('sortById');
const sortByFirstName = document.getElementById('sortByFirstName');
const sortByLastName = document.getElementById('sortByLastName');
const sortByHeight = document.getElementById('sortByHeight');
const sortByAge = document.getElementById('sortByAge');

let people = [];
let currentPage = 1;
let resultsPerPage = 10;
let sortColumn = 'Id';

fetch('./data/data.json')
  .then(response => response.json())
  .then(data => {
    people = data.People.map(person => ({
      ...person,
      Height: parseInt(person.Height)
    }));
    console.log(people)
    getTable();
  });

const resultsDropdownItems = document.querySelectorAll('#resultsPerPageDropdown');
resultsDropdownItems.forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    const selectedValue = parseInt(e.target.textContent);
    resultsPerPage = selectedValue;
    currentPage = 1;
    getTable();
  });
});

sortById.addEventListener('click', () => sortTable('Id'));
sortByFirstName.addEventListener('click', () => sortTable('FirstName'));
sortByLastName.addEventListener('click', () => sortTable('LastName'));
sortByHeight.addEventListener('click', () => sortTable('Height'));
sortByAge.addEventListener('click', () => sortTable('Age'));

function getTable() {
  const tableBody = document.getElementById('tableBody');
  tableBody.innerHTML = '';
  
  let sortedData = [...people].sort((a, b) => {
    let valA = a[sortColumn], valB = b[sortColumn];
    if (typeof valA === 'string') {
      return valA.localeCompare(valB);
    }
    return valA - valB;
  });
  
  let start = (currentPage - 1) * resultsPerPage;
  let paginatedData = sortedData.slice(start, start + resultsPerPage);
  
  paginatedData.forEach(person => {
    let row = `<tr>
      <td class="px-4 py-3">${person.Id}</td>
      <td class="px-4 py-3">${person.FirstName}</td>
      <td class="px-4 py-3">${person.LastName}</td>
      <td class="px-4 py-3">${person.Email}</td>
      <td class="px-4 py-3">${person.Height} inches</td>
      <td class="px-4 py-3">${person.Age}</td>
    </tr>`;
    tableBody.innerHTML += row;
  });
}

function sortTable(column) {
  sortColumn = column;
  getTable();
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    getTable();
  }
}

function nextPage() {
  const totalPages = Math.ceil(people.length / resultsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    getTable();
  }
}