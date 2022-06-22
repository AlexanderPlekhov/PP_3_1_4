package ru.kata.spring.boot_security.demo.configs;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.UserService;

import javax.annotation.PostConstruct;

@Component
public class DatabaseInit {
    private RoleService roleService;
    private UserService userService;

    @Autowired
    public DatabaseInit(RoleService roleService, UserService userService) {
        this.roleService = roleService;
        this.userService = userService;
    }

    @PostConstruct
    public void init() {
        Role roleAdmin = new Role("ADMIN");
        Role roleUser = new Role("USER");
        roleService.save(roleAdmin);
        roleService.save(roleUser);

        User admin = new User();
        admin.setUsername("admin");
        admin.setLastName("Adminovich");
        admin.setPassword("admin");
        admin.setEmail("admin@admin.com");
        admin.addRoleInSet(roleAdmin);
        admin.addRoleInSet(roleUser);
        userService.save(admin);

        User user = new User();
        user.setUsername("user");
        user.setLastName("lastUsername");
        user.setPassword("user");
        user.setEmail("user@user.com");
        user.addRoleInSet(roleUser);
        userService.save(user);
    }
}
