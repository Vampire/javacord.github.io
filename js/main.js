// TODO get base url dynamically
let javadocBaseUrl = 'https://docs.javacord.org/api/build/4655/';

// Get the wiki data
let wikiJson = [];
$.get('/api/wiki.json', function (data) {
    wikiJson = data;
}, 'json');

// Get JavaDoc methods
$.getScript(javadocBaseUrl + 'member-search-index.js', function () {
    // Search by length
    memberSearchIndex.sort(function(a, b) {
        return (a.c + '#' + a.l).length - (b.c + '#' + b.l).length;
    });
});

let searchBox = document.getElementById('search-box');
let lastSearchTerm = null;

// Removes suggestions
function removeSuggestions() {
    let autocompleteList = document.getElementById('autocomplete-list');
    if (autocompleteList !== null) {
        autocompleteList.remove();
    }
    lastSearchTerm = null;
}

// Displays suggestions for the search
function displaySuggestions() {
    // Don't rerender if it's the same search term
    if (lastSearchTerm === searchBox.value) {
        return;
    }
    lastSearchTerm = searchBox.value;

    // Don#t display suggestions for empty search terms
    if (searchBox.value === '') {
        return removeSuggestions();
    }

    // Remove if one already exists
    let autocompleteList = document.getElementById('autocomplete-list');
    if (autocompleteList !== null) {
        autocompleteList.remove();
    }

    // Add dropdown menu
    autocompleteList = document.createElement('div');
    autocompleteList.setAttribute('id', 'autocomplete-list');
    autocompleteList.setAttribute('class', 'dropdown-menu');
    searchBox.parentElement.appendChild(autocompleteList);

    // Fill dropdown menu
    let searchResults = searchWikiArticles(searchBox.value);
    autocompleteList.innerHTML += '<div class="dropdown-header"><strong>Wiki-Articles</strong></div>';
    if (searchResults.length <= 0) {
        autocompleteList.innerHTML += '<div class="dropdown-header">No results</div>';
    }
    for (let i = 0; i < searchResults.length; i++) {
        autocompleteList.appendChild(searchResults[i]);
    }

    searchResults = searchJavadocMethods(searchBox.value);
    autocompleteList.innerHTML += '<div class="dropdown-header"><strong>Methods</strong></div>';
    if (searchResults.length <= 0) {
        autocompleteList.innerHTML += '<div class="dropdown-header">No results</div>';
    }
    for (let i = 0; i < searchResults.length; i++) {
        autocompleteList.appendChild(searchResults[i]);
    }

    $('#autocomplete-list').dropdown('toggle');
}

// Search for wiki articles and return an array with html elements
function searchWikiArticles(search) {
    let searchResults = [];
    let counter = 0;
    for (let i = 0; i < wikiJson.length; i++) {
        if (wikiJson[i].title.toLowerCase().indexOf(search.toLowerCase()) !== -1) {
            let autocompleteElement = document.createElement('div');
            autocompleteElement.innerHTML = '<a class="dropdown-item" href="' + wikiJson[i].url + '" onclick="location.href = \'' + wikiJson[i].url + '\'">' + highlightWordsNoCase(wikiJson[i].title, searchBox.value) + '</a>';
            searchResults.push(autocompleteElement);
            counter++;
        }
        if (counter >= 5) {
            break;
        }
    }
    return searchResults;
}

// Search for javadooc methods and return an array with html elements
function searchJavadocMethods(search) {
    let searchResults = [];
    let counter = 0;
    for (let i = 0; i < memberSearchIndex.length; i++) {
        let packageName = memberSearchIndex[i].p;
        let className = memberSearchIndex[i].c;
        let methodName = memberSearchIndex[i].l;
        let url = memberSearchIndex[i].url;
        let fullName = className + '#' + methodName;
        // Skip internal methods
        if (packageName.indexOf('.internal') !== -1) {
            continue;
        }
        url = javadocBaseUrl + packageName.replace(/\./g, '/') + '/' + className + '.html#' + (url === undefined ? methodName.replace('(', '-').replace(')', '-') : url);
        if (fullName.toLowerCase().indexOf(search.toLowerCase()) !== -1) {
            let autocompleteElement = document.createElement('div');
            autocompleteElement.innerHTML = '<a class="dropdown-item" href="' + url + '" onclick="location.href = \'' + url + '\'">' + highlightWordsNoCase(fullName, searchBox.value) + '</a>';
            searchResults.push(autocompleteElement);
            counter++;
        }
        if (counter >= 5) {
            break;
        }
    }
    return searchResults;
}

// Escapes regex characters
RegExp.escape = function(str) {
    var specials = /[.*+?|()\[\]{}\\$^]/g; // .*+?|()[]{}\$^
    return str.replace(specials, '\\$&');
};

// Highlights the given word
function highlightWordsNoCase(line, word) {
    var regex = new RegExp('(' + RegExp.escape(word) + ')', 'gi');
    return line.replace(regex, '<strong>$1</strong>');
}

// Add some event listeners to update the suggestions
searchBox.addEventListener('focusin', () => displaySuggestions());
searchBox.addEventListener('focusout', () => setTimeout(() => removeSuggestions(), 200));
$('#search-box').on('change keydown paste input', function() {
    displaySuggestions();
});