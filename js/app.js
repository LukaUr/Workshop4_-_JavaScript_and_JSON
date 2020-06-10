$(() => {

    const $container = $('#mainContainer');
    const $titleForm = $('input[name="title"]');
    const $authorForm = $('input[name="author"]');
    const $isbnForm = $('input[name="isbn"]');
    const $publisherForm = $('input[name="publisher"]');
    const $typeForm = $('input[name="type"]');
    const $idForm = $('input[name="id"]');
    const $addButton = $('#addButton');
    const $sendButton = $('#send');
    const $editButton = $('#edit');
    const $cancelButton = $('#cancel');
    const $formDiv = $('#form-div');

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

    const showBookDetails = (bookId) => {
        const $bookDetailsDiv = $('[data-book-id="' + bookId + '"]').next('.book-details');
        if ($bookDetailsDiv.is(':empty')) {
            $.ajax({
                url: "http://localhost:8282/books/" + bookId,
                dataType: "JSON",
                method: "GET"
            }).done((response) => {
                let text = `Title: ${response.title}<br>Author: ${response.author}<br>
Id: ${response.id}<br>ISBN: ${response.isbn}<br>Publisher: ${response.publisher}<br>
Type: ${response.type}`
                $bookDetailsDiv.html(text);
                $bookDetailsDiv.slideToggle('fast');
            })
        } else {
            $bookDetailsDiv.slideToggle('fast');
        }
    }

    const createBookItem = (element) => {
        const $bookCoverDiv = $('<div class="book-cover">')
        const $bookDiv = $('<div class="book">');
        const $bookTitleDiv = $('<div class="book-title">');
        const $bookDetails = $('<div class="book-details">');
        const $deleteButton = $('<div class="deleteButton">')
        const $editButton = $('<div class="editButton">');
        $bookTitleDiv.text(element.title);
        $deleteButton.text('Delete')
        $editButton.text('Edit');
        $bookTitleDiv.attr('data-book-id', element.id);
        $bookTitleDiv.append($deleteButton);
        $bookTitleDiv.append($editButton);
        $bookDiv.append($bookTitleDiv);
        $bookDiv.append($bookDetails);
        $bookCoverDiv.append($bookDiv)
        $container.prepend($bookCoverDiv);
    }

    const addEventsOnBooks = () => {
        $container.on('click', '.book-title', function () {
            const bookID = $(this).data('bookId');
            showBookDetails(bookID);
        })
    }

    const addEventsOnDeleteButtons = () => {
        $container.on('click', '.deleteButton', function (e) {
            e.stopPropagation();
            const bookID = $(this).parent().data('bookId');
            deleteBook(bookID);
        })
    }

    const addEventsOnEditButtons = () => {
        $container.on('click', '.editButton', function (e) {
            e.stopPropagation();
            const bookID = $(this).parent().data('bookId');
            editBook(bookID);
        })
    }

    const addBook = () => {
        let book = {};
        book.title = $titleForm.val();
        book.author = $authorForm.val();
        book.isbn = $isbnForm.val();
        book.publisher = $publisherForm.val();
        book.type = $typeForm.val();
        $.ajax({
            url: "http://localhost:8282/books/",
            data: JSON.stringify(book),
            contentType: "application/json",
            dataType: "JSON",
            method: "POST"
        }).done((response) => {
            createBookItem(response);
            animateBlink(response.id);
            $formDiv.slideUp();
        });
    };

    const deleteBook = (bookId) => {
        $.ajax({
            url: "http://localhost:8282/books/" + bookId,
            contentType: "application/json",
            dataType: "JSON",
            method: "DELETE",
        }).done((response) => {
            animateBlink(bookId);
            setTimeout(() => $(`[data-book-id="${bookId}"]`).parent().parent().remove(), 800)
        });
    };

    const editBook = (bookId) => {
        $editButton.css('display', 'inline-block');
        $sendButton.css('display', 'none');
        $formDiv.slideDown('fast');
    }

    $addButton.on('click', () => {
        $sendButton.css('display', 'inline-block');
        $editButton.css('display', 'none');
        $formDiv.slideDown('fast');
    });

    $sendButton.on('click', (e) => {
        e.preventDefault();
        addBook();
    });

    $cancelButton.on('click', (e) => {
        e.preventDefault();
        $formDiv.slideUp('fast');
    });

    const animateBlink = (id) => {
        const $animatedButton = $(`[data-book-id="${id}"]`);
        $animatedButton.addClass('slowTransition');
        const blinksCount = 2;
        for (let i = 0; i < blinksCount * 2; i++) {
            setTimeout(() => $animatedButton.toggleClass('white'), 200 * i);
        }
        setTimeout($animatedButton.removeClass('slowTransition'), blinksCount * 400);
    };

    readBooks();
    addEventsOnBooks();
    addEventsOnDeleteButtons();
    addEventsOnEditButtons();

})