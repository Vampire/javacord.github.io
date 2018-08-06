// TODO get base url dynamically
let javadocBaseUrl = 'https://docs.javacord.org/api/v/';
let memberSearchIndex = [];
let typeSearchIndex = [];

// Get all release versions
$.get('https://docs.javacord.org/rest/versions', function (versions) {
    let dropdown = document.getElementById('changelog-dropdown-content');

    for (let i = 0; i < versions.length; i++) {
        if (i >= 10) {
            break;
        }

        if (i === 1) {
            let dropdownDivider = document.createElement('div');
            dropdownDivider.setAttribute('class', 'dropdown-divider');
            dropdown.appendChild(dropdownDivider);
        }

        let dropdownElement = document.createElement('a');
        dropdownElement.setAttribute('class', 'dropdown-item');
        dropdownElement.setAttribute('href', 'https://github.com/Javacord/Javacord/releases/tag/v' + versions[i]);
        dropdownElement.innerText = versions[i];
        if (i === 0) {
            dropdownElement.innerText += ' (latest)';
        }
        dropdown.appendChild(dropdownElement);
    }

}, 'json');

// Get the latest version
$.get('https://docs.javacord.org/rest/latest-version/release', function (data) {
    javadocBaseUrl += data.version + '/';

    // Get JavaDoc methods
    $.getScript(javadocBaseUrl + 'member-search-index.js', function () {
        // Sort by length
        memberSearchIndex.sort(function(a, b) {
            return (a.c + '#' + a.l).length - (b.c + '#' + b.l).length;
        });
    });

    // Get JavaDoc classes
    $.getScript(javadocBaseUrl + 'type-search-index.js', function () {
        // Sort by length
        typeSearchIndex.sort(function(a, b) {
            return a.l.length - b.l.length;
        });
    });

    // Replace ${latest-version} with the latest version
    replaceInDOM(document.body, /\${latest-version}/g, data.version);

}, 'json');

// Get the wiki data
let wikiJson = [];
$.get('/api/wiki.json', function (data) {
    wikiJson = data;
}, 'json');

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

    searchResults = searchJavadocClasses(searchBox.value);
    autocompleteList.innerHTML += '<div class="dropdown-header"><strong>Classes</strong></div>';
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

// Search for javadooc classes and return an array with html elements
function searchJavadocClasses(search) {
    let searchResults = [];
    let counter = 0;
    for (let i = 0; i < typeSearchIndex.length; i++) {
        let packageName = typeSearchIndex[i].p;
        let className = typeSearchIndex[i].l;
        // Skip internal methods
        if (packageName.indexOf('.internal') !== -1) {
            continue;
        }
        let url = javadocBaseUrl + packageName.replace(/\./g, '/') + '/' + className + '.html';
        if (className.toLowerCase().indexOf(search.toLowerCase()) !== -1) {
            let autocompleteElement = document.createElement('div');
            autocompleteElement.innerHTML = '<a class="dropdown-item" href="' + url + '" onclick="location.href = \'' + url + '\'">' + highlightWordsNoCase(className, searchBox.value) + '</a>';
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

// Anchors
document.addEventListener("DOMContentLoaded", function(event) {
    anchors.add('h1:not(.no-anchor)');
    anchors.add('h2:not(.no-anchor)');
    anchors.add('h3:not(.no-anchor)');
});

// Replace placeholders
function replaceInDOM(node, pattern, replacement) {
    if (node.nodeType === 3) {
        node.data = node.data.replace(pattern, replacement);
    }
    if (node.nodeType === 1 && node.nodeName !== "SCRIPT") {
        for (var i = 0; i < node.childNodes.length; i++) {
            replaceInDOM(node.childNodes[i], pattern, replacement);
        }
    }
}