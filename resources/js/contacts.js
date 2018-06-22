$(document).ready(function () {

    const listId = "contacts-list";
    const baseUrl = "/api/contacts";
    var contacts = [];
    var modalType = 1; // 1 - CREATE CONTACT, 2 - EDIT CONTACT
    var selectedContact;
    var inputNames = ['first_name', 'last_name', 'telephone_number'];
    var filter = {
        key: 'last_name',
        value: ''
    };


    function getContacts(filterValue) {

        var _url = baseUrl;

        if (filterValue) {
            _url += "?key=" + filter.key + "&value=" + filterValue
        }


        $.ajax({
            url: _url,
            type: "GET",
            success: function (res) {
                console.log(res)
                contacts = res;
                render(res);
            }
        });
    }
    getContacts();

    function deleteContact(id) {
        $.ajax({
            url: baseUrl + "/" + id,
            type: "DELETE",
            success: function (res) {
                getContacts();
            }
        });
    }

    function render(data) {
        $("#" + listId).empty();
        data.forEach(function (el) {
            var _html = `
                <tr class="body-tr">
                    <th scope="row">` + el.first_name + `</th>
                    <td>` + el.last_name + `</td>
                    <td>` + el.telephone_number + `</td>
                    <td class="contacts-options">
                        <i contact-id=\"` + el.id + `\" class="fas fa-trash-alt delete-contact-btn"></i>
                        <i contact-id=\"` + el.id + `\" class="fas fa-edit edit-contact-btn"></i>
                    </td>
                </tr>
            `

            $('#' + listId).append(_html);
        })
    }

    function initEditModal() {

        inputNames.forEach(function (name) {
            $('input[name=' + name + ']').val(selectedContact[name])
        })

        modalType = 2; // EDIT TYPE
        handleModal('show');
    }

    function handleModal(action) {
        if (action == 'show') {
            var _title = modalType == 1 ? "Dodaj Novi Kontakt" : 2 ? "Izmeni Kontakt" : null
            $('.modal-title').text(_title);
        }

        $('#create-modal').modal(action);
    }

    function clearInputs() {
        $('input').val('');
    }

    $('#fab').click(function () {
        modalType = 1;
        handleModal('show');
    });

    $('#create-form').submit(function (e) {
        e.preventDefault();

        var body = {};
        var inputs = $(this).find('input');

        inputs.each(function (idx) {
            var input = $(inputs[idx])
            body[input.attr('name')] = input.val()
        })

        var _url = modalType == 1 ? baseUrl : 2 ? baseUrl + "/" + selectedContact.id : null
        var _method = modalType == 1 ? 'POST' : 2 ? 'PUT' : null

        $.ajax({
            url: _url,
            type: _method,
            contentType: "application/json",
            data: JSON.stringify(body),
            success: function (res) {
                clearInputs();
                handleModal('hide');
                getContacts();
            }
        });

    });

    $('#filter-key').change(function() {
        clearInputs();
        filter.key = $(this).val();
        getContacts();
    });

    $('input#filter').keyup(function() {
        getContacts($(this).val());
    });

    $(document).on('click', 'i.delete-contact-btn', function (e) {
        deleteContact($(this).attr("contact-id"));
    })

    $(document).on('click', 'i.edit-contact-btn', function (e) {
        var _id = $(this).attr('contact-id');
        var selected = contacts.find(function (c) {
            return c.id == _id
        });
        selectedContact = selected;
        initEditModal();
    })

    $('#create-modal').on('hidden.bs.modal', function () {
        clearInputs();
    })

})