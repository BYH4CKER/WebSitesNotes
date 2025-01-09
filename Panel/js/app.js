$(document).ready(function () {
    loadUsers();

    // DataTables başlat
    $('#userTable').DataTable();

    // Form gönderimi
    $("#userForm").on("submit", function (e) {
        e.preventDefault();
        var id = $("#id").val();
        var name = $("#name").val();
        var email = $("#email").val();
        var phone = $("#phone").val();
        var action = id ? 'update' : 'create';

        $.ajax({
            url: 'php/process.php',
            type: 'POST',
            data: { action, id, name, email, phone },
            success: function (response) {
                if (response === "success") {
                    toastr.success(action === 'update' ? "Kullanıcı güncellendi!" : "Kullanıcı eklendi!");
                    clearForm();
                    loadUsers();
                } else {
                    toastr.error("Bir hata oluştu.");
                }
            }
        });
    });

    function loadUsers() {
        $.ajax({
            url: 'php/process.php',
            type: 'POST',
            data: { action: 'read' },
            dataType: 'json',
            success: function (data) {
                var tbody = $("#userTable tbody");
                tbody.empty();
                $("#userCount").text(data.length + " kullanıcı bulundu.");
                $.each(data, function (index, user) {
                    tbody.append(
                        `<tr data-id="${user.id}" data-status="${user.status}">
                            <td>${user.id}</td>
                            <td>${user.name}</td>
                            <td>${user.email}</td>
                            <td>${user.phone}</td>
                            <td>${user.status}</td>
                            <td>
                                <button class="btn btn-warning editBtn"><i class="fas fa-edit"></i> Düzenle</button>
                                <button class="btn btn-danger deleteBtn"><i class="fas fa-trash"></i> Sil</button>
                            </td>
                        </tr>`
                    );
                });

                // Düzenle butonuna basıldığında
                $(".editBtn").on("click", function () {
                    var row = $(this).closest("tr");
                    $("#id").val(row.data("id"));
                    $("#name").val(row.children("td:nth-child(2)").text());
                    $("#email").val(row.children("td:nth-child(3)").text());
                    $("#phone").val(row.children("td:nth-child(4)").text());
                    $("#submitBtn").text("Güncelle");
                });

                // Sil butonuna basıldığında
                $(".deleteBtn").on("click", function () {
                    if (confirm("Bu kullanıcıyı silmek istediğinize emin misiniz?")) {
                        var id = $(this).closest("tr").data("id");
                        $.ajax({
                            url: 'php/process.php',
                            type: 'POST',
                            data: { action: 'delete', id },
                            success: function (response) {
                                if (response === "success") {
                                    toastr.success("Kullanıcı silindi!");
                                    loadUsers();
                                } else {
                                    toastr.error("Silme işlemi sırasında hata oluştu.");
                                }
                            }
                        });
                    }
                });
            }
        });
    }

    function clearForm() {
        $("#id").val('');
        $("#name").val('');
        $("#email").val('');
        $("#phone").val('');
        $("#submitBtn").text("Ekle");
    }

    $("#clearBtn").on("click", function () {
        clearForm();
    });
});
