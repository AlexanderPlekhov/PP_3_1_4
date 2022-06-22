package ru.kata.spring.boot_security.demo.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;
import java.util.Collection;
import java.util.HashSet;

@Data
@Entity
@NoArgsConstructor
@Table(name = "users")
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false, nullable = false, unique=true)
    private Long id;

    @Column(name = "name")
    @NotEmpty(message = "Поле \"Name\" не может быть пустым")
    @Size(min=2, message = "\"Name\" должно состоять не менее, чем из двух букв")
    private String username;

    @Column(name = "last_name")
    @NotEmpty(message = "Поле \"Last Name\" не может быть пустым")
    @Size(min=2, message = "\"Last Name\" должно состоять не менее, чем из двух букв")
    private String lastName;

    @Column(name = "age")
    private byte age;

    @Column(name = "email")
    @NotEmpty(message = "Поле \"E-mail\" обязательно для заполнения")
    @Size(min=8, message = "Поле \"E-mail\" должно состоять не менее, чем из 8 знаков")
    private String email;

    @Column(name = "password")
    @NotEmpty(message = "Поле \"Password\" обязательно для заполнения")
    private String password;

    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.REFRESH)
    @JoinTable(name = "users_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Collection<Role> roles = new HashSet<>();

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles;
    }
    public void addRoleInSet(Role role) {
        roles.add(role);
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
