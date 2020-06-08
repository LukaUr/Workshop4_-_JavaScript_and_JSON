$(() => {

    const readBooks = () => {
        $.ajax({
            url: "http://localhost:8282/books/",
            contentType: "application/json",
            dataType: "JSON",
            method: "GET"
        }).done((response) => {
            response.forEach((el) => createBookItem(el));
        })
    }

    const getBookDetails = (bookId) => {
        if ($('[data-book-id="' + bookId + '"]').next('.book-details').is(':empty')) {
            $.ajax({
                url: "http://localhost:8282/books/" + bookId,
                dataType: "JSON",
                method: "GET"
            }).done((response) => showBookDetails(response));
        } else {
            showBookDetails(bookId);
        }
    }

    const createBookItem = (element) => {
        const $bookCoverDiv = $('<div class="book-cover">')
        const $bookDiv = $('<div class="book">');
        const $bookTitleDiv = $('<div class="book-title">');
        const $bookDetails = $('<div class="book-details">');
        $bookTitleDiv.text(element.title);
        $bookTitleDiv.attr('data-book-id', element.id);
        $bookDiv.append($bookTitleDiv);
        $bookDiv.append($bookDetails);
        $bookCoverDiv.append($bookDiv)
        $container.append($bookCoverDiv);
    }

    const showBookDetails = (response) => {
        let $bookDetailDiv = null;
        if (jQuery.type(response) == 'number') {
            $bookDetailDiv = $('[data-book-id="' + response + '"]').next('.book-details');
        } else {
            const bookId = response.id;
            $bookDetailDiv = $('[data-book-id="' + bookId + '"]').next('.book-details');
            let text = `Title: ${response.title}<br>Author: ${response.author}<br>
Id: ${response.id}<br>ISBN: ${response.isbn}<br>Publisher: ${response.publisher}<br>
Type: ${response.type}`
            $bookDetailDiv.html(text);

        }
        $bookDetailDiv.slideToggle('fast');
    }

    const addEventsOnBooks = () => {
        $container.on('click', '.book-title', function () {
            const bookID = $(this).data('bookId');
            getBookDetails(bookID);
        })
    }

    const $container = $('#mainContainer');
    readBooks();
    addEventsOnBooks();

})