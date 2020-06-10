$(() => {

    //divs
    const $container = $('#mainContainer');
    const $formDiv = $('#form-div');
    //form fields
    const $titleForm = $('input[name="title"]');
    const $authorForm = $('input[name="author"]');
    const $isbnForm = $('input[name="isbn"]');
    const $publisherForm = $('input[name="publisher"]');
    const $typeForm = $('input[name="type"]');
    const $idForm = $('input[name="id"]');
    //buttons
    const $addButton = $('#addButton');
    const $sendButton = $('#send');
    const $editButton = $('#edit');
    const $cancelButton = $('#cancel');

    //JSON

    const sendJSON = (method, bookId, data, output) => {
        $.ajax({
            url: "http://localhost:8282/books/" + bookId,
            data: data,
            dataType: "JSON",
            contentType: "application/json",
            method: method
        }).done((response) => {
            if (method === 'GET' && bookId !== '') {
                if (output === 'detailsDiv') {
                    fillDetailsDivWithData(bookId, response);
                } else if (output === 'form') {
                    fillFormWithData(response);
                } else {
                    alert('Something went wrong...')
                }
            }
            if (method === 'GET' && bookId === '') {
                response.forEach((el) => renderBookItem(el));
            }
            if (method === 'DELETE') {
                animateBlink(bookId);
                setTimeout(() => $(`[data-book-id="${bookId}"]`).parent().parent().remove(), 800)
            }
            if (method === 'POST') {
                renderBookItem(response);
                animateBlink(response.id);
                $formDiv.slideUp();
            }
            if (method === 'PUT') {
                animateBlink(bookId);
                updateBookTitleDiv(bookId);
                $bookDiv.next('.book-details').empty().slideUp();
                $formDiv.slideUp();
            }
        }).fail(() => {
            if (method === 'GET') alert('Failed to read book info from database');
            if (method === 'DELETE') alert('Failed to delete book from database');
            if (method === 'POST') alert('Failed to add book to database');
            if (method === 'PUT') alert('Failed to update book info in database');
        });
    }

    //events

    const addEventsOnBooks = () => {
        $container.on('click', '.book-title', function () {
            const bookID = $(this).data('bookId');
            showBookDetails(bookID);
        });
    }

    const addEventsOnDeleteButtons = () => {
        $container.on('click', '.deleteButton', function (e) {
            e.stopPropagation();
            const bookID = $(this).parent().data('bookId');
            sendJSON('DELETE', bookID, '');
        });
    }

    const addEventsOnEditButtons = () => {
        $container.on('click', '.editButton', function (e) {
            e.stopPropagation();
            const bookID = $(this).parent().data('bookId');
            editBook(bookID);
        });
    }

    $addButton.on('click', () => {
        $sendButton.css('display', 'inline-block');
        $editButton.css('display', 'none');
        $formDiv.find('input[type=text], input[type=number]').val("");
        $formDiv.slideDown('fast');
    });

    $sendButton.on('click', (e) => {
        e.preventDefault();
        const book = JSON.stringify(getBookFromForm());
        sendJSON('POST', '', book);
    });

    $editButton.on('click', (e) => {
        e.preventDefault();
        const book = getBookFromForm();
        sendJSON('PUT', book.id, JSON.stringify(book));
    });

    $cancelButton.on('click', (e) => {
        e.preventDefault();
        $formDiv.slideUp('fast');
    });

    //methods

    const showBookDetails = (bookId) => {
        const $bookDetailsDiv = $('[data-book-id="' + bookId + '"]').next('.book-details');
        if ($bookDetailsDiv.is(':empty')) {
            sendJSON('GET', bookId, null, 'detailsDiv');
        } else {
            $bookDetailsDiv.slideToggle('fast');
        }
    }

    const renderBookItem = (element) => {
        const $bookCoverDiv = $('<div class="book-cover">');
        const $bookDiv = $('<div class="book">');
        const $bookTitleDiv = $('<div class="book-title">');
        const $bookDetails = $('<div class="book-details">');
        const $deleteButton = $('<div class="deleteButton">')
        const $editButton = $('<div class="editButton">');
        $bookTitleDiv.text(element.title);
        $deleteButton.text('Delete');
        $editButton.text('Edit');
        $bookTitleDiv.attr('data-book-id', element.id);
        $bookTitleDiv.append($deleteButton);
        $bookTitleDiv.append($editButton);
        $bookDiv.append($bookTitleDiv);
        $bookDiv.append($bookDetails);
        $bookCoverDiv.append($bookDiv)
        $container.prepend($bookCoverDiv);
    }

    const getBookFromForm = () => {
        let book = {};
        book.title = $titleForm.val();
        book.author = $authorForm.val();
        book.isbn = $isbnForm.val();
        book.publisher = $publisherForm.val();
        book.type = $typeForm.val();
        book.id = $idForm.val();
        return book;
    }

    const editBook = (bookId) => {
        $editButton.css('display', 'inline-block');
        $sendButton.css('display', 'none');
        sendJSON('GET', bookId, {}, 'form');
    }

    const fillDetailsDivWithData = (bookId, response) => {
        const $bookDetailsDiv = $('[data-book-id="' + bookId + '"]').next('.book-details');
        let text = `Title: ${response.title}<br>Author: ${response.author}<br>`;
        text += `Id: ${response.id}<br>ISBN: ${response.isbn}<br>`;
        text += `Publisher: ${response.publisher}<br>Type: ${response.type}`;
        $bookDetailsDiv.html(text);
        $bookDetailsDiv.slideDown('fast');
    }

    const fillFormWithData = (response) => {
        $titleForm.val(response.title);
        $authorForm.val(response.author);
        $isbnForm.val(response.isbn);
        $publisherForm.val(response.publisher);
        $typeForm.val(response.type);
        $idForm.val(response.id);
        $formDiv.slideDown('fast');
    }

    const updateBookTitleDiv = (bookId) => {
        const $bookDiv = $(`[data-book-id="${bookId}"]`);
        const $temp = $bookDiv.children();
        $bookDiv.text($titleForm.val());
        $bookDiv.append($temp);
    }

    const animateBlink = (id) => {
        const $animatedButton = $(`[data-book-id="${id}"]`);
        $animatedButton.addClass('slowTransition');
        const blinksCount = 2;
        for (let i = 0; i < blinksCount * 2; i++) {
            setTimeout(() => $animatedButton.toggleClass('blink'), 200 * i);
        }
        setTimeout(() => $animatedButton.removeClass('slowTransition'), blinksCount * 400);
    }

    //initial content load

    sendJSON('GET', ''); //fetch books
    addEventsOnBooks();
    addEventsOnDeleteButtons();
    addEventsOnEditButtons();

});
