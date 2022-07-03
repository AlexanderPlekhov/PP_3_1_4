$(async function () {
    allUsersTable()
    tableWithUserID()
    addNewUserForm()
    createUser()
    getDefaultModal()
})

// all roles
const roleJson = []
fetch('api/roles')
    .then(res => res.json())
    .then(roles => roles.forEach(role => roleJson.push(role)))

// fetch
const userFetchService = {
    head: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Referer': null
    },

    findAllUsers: async () => await fetch('api/users'),
    getCurrentUser: async () => await fetch('api/user'),
    createUser: async (user) => await fetch('api/users', {
        method: 'POST',
        headers: userFetchService.head,
        body: JSON.stringify(user)
    }),
    findUserById: async (id) => await fetch(`api/users/${id}`),
    deleteUser: async (id) => await fetch(`api/users/${id}`, {
        method: 'DELETE',
        headers: userFetchService.head
    }),
    updateUser: async (user) => await fetch('api/users', {
        method: 'PATCH',
        headers: userFetchService.head,
        body: JSON.stringify(user)
    })
}

// admin-user
async function tableWithUserID() {
    let table = $('#tableWithUserID')
    table.empty()

    await userFetchService.getCurrentUser()
        .then(res => res.json())
        .then(user => {
            let tablePrincipal = `$(
                <tr>
                    <td>${user.id}</td>
                    <td>${user.username}</td>
                    <td>${user.lastName}</td>
                    <td>${user.age}</td>
                    <td>${user.email}</td>
                    <td>${user.roles.map(role => role.name)}</td>
                </tr>            
            )`
            table.append(tablePrincipal)
        })
}

// all users
async function allUsersTable() {
    let table = $('#tableAllUsers tbody')
    table.empty()
    await userFetchService.findAllUsers()
        .then(res => res.json())
        .then(users => {
            users.forEach(user => {
                let result = `$(
                <tr>
                    <td>${user.id}</td>
                    <td>${user.username}</td>
                    <td>${user.lastName}</td>
                    <td>${user.age}</td>
                    <td>${user.email}</td>
                    <td>${user.roles.map(role => role.name)}</td>
                    <td>
                        <button type="button" data-userid="${user.id}" data-action="edit" class="btn btn-info"
                        data-toggle="modal" data-target="#someDefaultModal">Edit</button>
                    </td>
                    <td>
                        <button type="button" data-userid="${user.id}" data-action="delete" class="btn btn-danger"
                        data-toggle="modal" data-target="#someDefaultModal">Delete</button>
                    </td>
                </tr>
            )`;
                table.append(result)
            })
        })

    $("#tableAllUsers").find('button').on('click', (event) => {
        let defaultModal = $('#someDefaultModal')

        let targetButton = $(event.target);
        let buttonUserId = targetButton.attr('data-userid')
        let buttonAction = targetButton.attr('data-action')

        defaultModal.attr('data-userid', buttonUserId)
        defaultModal.attr('data-action', buttonAction)
        defaultModal.modal('show')
    })
}

// create new user
async function createUser() {
    $('#addNewUserButton').on('click', async (e) => {
        let addUserForm = $('#addUserForm')
        let username = addUserForm.find('#usernameNewUser').val().trim()
        let lastName = addUserForm.find('#lastNameNewUser').val().trim()
        let age = addUserForm.find('#ageNewUser').val().trim()
        let email = addUserForm.find('#emailNewUser').val().trim()
        let password = addUserForm.find('#passwordNewUser').val().trim()
        let rolesArray = addUserForm.find('#newRoles').val()
        let roles = []

        for (let r of roleJson) {
            for (let i = 0; i < rolesArray.length; i++) {
                if (r.id == rolesArray[i]) {
                    roles.push(r)
                }
            }
        }

        let data = {
            username: username,
            lastName: lastName,
            age: age,
            email: email,
            password: password,
            roles: roles
        }
        const response = await userFetchService.createUser(data)
        if (response.ok) {
            allUsersTable()
        }
    })
}

// user-form
async function addNewUserForm() {
    let form = $(`#addUserForm`)

    fetch('/api/roles').then(function (response) {
        form.find('#newRoles').empty()
        response.json().then(roleList => {
            roleList.forEach(role => {
                form.find('#newRoles')
                    .append($('<option>').val(role.id).text(role.name))
            })
        })
    })
}

// delete user
async function deleteUser(modal, id) {
    let thisUser = await userFetchService.findUserById(id)
    let user = thisUser.json()
    let modalForm = $(`#someDefaultModal`)
    let deleteButton = `<button class="btn btn-danger" id="deleteButton" data-dismiss="modal" data-backdrop="false">Delete</button>`
    let closeButton = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>`

    modal.find('.modal-title').html('Delete user')
    modal.find('.modal-footer').append(deleteButton)
    modal.find('.modal-footer').append(closeButton)

    user.then(user => {
        let bodyForm = `<form id="deleteUser">
                            <div class="col-md-7 offset-md-3 text-center">
                                <div class="form-group">
                                    <span class="font-weight-bold">ID</span>
                                    <input type="text" value="${user.id}" name="id" class="form-control" readonly>
                                </div>
                                <div class="form-group">
                                    <span class="font-weight-bold">First Name</span>
                                    <input type="text" value="${user.username}" name="username" class="form-control" disabled/>
                                </div>
                                <div class="form-group">
                                    <span class="font-weight-bold">Last Name</span>
                                    <input type="text" value="${user.lastName}" name="lastName" class="form-control" disabled/>
                                </div>
                                <div class="form-group">
                                    <span class="font-weight-bold">Age</span>
                                    <input type="number" value="${user.age}" name="age" class="form-control" disabled/>
                                </div>
                                <div class="form-group">
                                    <span class="font-weight-bold">Email</span>
                                    <input type="email" value="${user.email}" name="email" class="form-control" disabled/>
                                </div>
                                <div class="form-group">
                                    <span class="font-weight-bold">Role</span>
                                    <select multiple class="form-control" id="deleteRoles" size="2" disabled/>`

        modal.find('.modal-body').append(bodyForm)
    })

    fetch('/api/roles').then(function (response) {
        modalForm.find('#deleteRoles').empty()
        response.json().then(roleList => {
            roleList.forEach(role => {
                modalForm.find('#deleteRoles')
                    .append($('<option>').val(role.id).text(role.name));
            })
        })
    })

    $(`#deleteButton`).on('click', async () => {
        const response = await userFetchService.deleteUser(id)
        if (response.ok) {
            allUsersTable()
            modal.modal('hide');
        }
    })
}

// edit user
async function editUser(modal, id) {
    let thisUser = await userFetchService.findUserById(id)
    let user = thisUser.json()
    let modalForm = $(`#someDefaultModal`)
    let editButton = `<button class="btn btn-info" id="editButton" data-dismiss="modal" data-backdrop="false">Edit</button>`
    let closeButton = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>`

    modal.find('.modal-title').html('Edit user')
    modal.find('.modal-footer').append(editButton)
    modal.find('.modal-footer').append(closeButton)

    user.then(user => {
        let bodyForm = `<form id="editUser">
                            <div class="col-md-7 offset-md-3 text-center">
                                <div class="form-group">
                                    <span class="font-weight-bold">ID</span>
                                    <input type="text" value="${user.id}" name="id" id="id" class="form-control" disabled/>
                                </div>
                                <div class="form-group">
                                    <span class="font-weight-bold">First Name</span>
                                    <input type="text" value="${user.username}" name="username" id="username" class="form-control"/>
                                </div>
                                <div class="form-group">
                                    <span class="font-weight-bold">Last name</span>
                                    <input type="text" value="${user.lastName}" name="lastName" id="lastName" class="form-control"/>
                                </div>
                                <div class="form-group">
                                    <span class="font-weight-bold">Age</span>
                                    <input type="number" value="${user.age}" name="age" id="age" class="form-control"/>
                                </div>
                                <div class="form-group">
                                    <span class="font-weight-bold">Email</span>
                                    <input type="email" value="${user.email}" name="email" id="email" class="form-control"/>
                                </div>
                                <div class="form-group">
                                    <span class="font-weight-bold">Password</span>
                                    <input type="password" name="password" id="password" class="form-control"/>
                                </div>
                                <div class="form-group">
                                    <span class="font-weight-bold">Role</span>
                                    <select multiple class="form-control" id="updateRoles" size="2">`
        modal.find('.modal-body').append(bodyForm)
    })

    fetch('/api/roles').then(function (response) {
        modalForm.find('#updateRoles').empty()
        response.json().then(roleList => {
            roleList.forEach(role => {
                modalForm.find('#updateRoles')
                    .append($('<option>').val(role.id).text(role.name));
            })
        })
    })

    $("#editButton").on('click', async () => {
        let id = modal.find('#id').val()
        let username = modal.find('#username').val()
        let lastName = modal.find('#lastName').val()
        let age = modal.find('#age').val()
        let email = modal.find('#email').val()
        let password = modal.find('#password').val()
        let rolesArray = modal.find('#updateRoles').val()
        let roles = []

        for (let r of roleJson) {
            for (let i = 0; i < rolesArray.length; i++) {
                if (r.id == rolesArray[i]) {
                    roles.push(r)
                }
            }
        }

        let data = {
            id: id,
            username: username,
            lastName: lastName,
            age: age,
            email: email,
            password: password,
            roles: roles
        }

        const response = await userFetchService.updateUser(data)
        if (response.ok) {
            allUsersTable()
            modal.modal('hide')
        }
    })
}

async function getDefaultModal() {
    $('#someDefaultModal').modal({
        keyboard: true,
        backdrop: "static",
        show: false
    }).on("show.bs.modal", (event) => {
        let thisModal = $(event.target);
        let userid = thisModal.attr('data-userid')
        let action = thisModal.attr('data-action')
        switch (action) {
            case 'edit':
                editUser(thisModal, userid);
                break;
            case 'delete':
                deleteUser(thisModal, userid);
                break;
        }
    }).on("hidden.bs.modal", (e) => {

        let thisModal = $(e.target);
        thisModal.find('.modal-title').html('')
        thisModal.find('.modal-body').html('')
        thisModal.find('.modal-footer').html('')
    })
}

