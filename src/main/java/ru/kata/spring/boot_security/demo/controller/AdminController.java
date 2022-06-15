package ru.kata.spring.boot_security.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.UserService;

import javax.validation.Valid;

@Controller
@RequestMapping("/admin")
public class AdminController {
    private UserService userService;
    private RoleService roleService;

    @Autowired
    public void setUserService(UserService userService) {this.userService = userService;}
    @Autowired
    public void setRoleService(RoleService roleService) {this.roleService = roleService;}


    @GetMapping()
    public String adminPage() {
        return "admin";
    }

    @GetMapping("/users")
    public String allUsers(Model model) {
        model.addAttribute("users", userService.findAll());
        return "adminView/users";
    }

    @GetMapping("/users/new")
    public String addUser(@ModelAttribute("user") User user, Model model) {
        model.addAttribute("roles", roleService.findAll());
        return "adminView/newUser";
    }

    @PostMapping("/users")
    public String create(@ModelAttribute("user") @Valid User user,
                         @ModelAttribute("userRoles") Long[] identity,
                         BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return "adminView/newUser";
        }
        if(identity != null) {
            for (Long roleId : identity) {
                user.addRoleInSet(roleService.findRoleById(roleId));
            }
        } else {
            user.addRoleInSet(roleService.findRoleById(2L));
        }
        userService.save(user);
        return "redirect:/admin/users";
    }

    @GetMapping("users/edit/{id}")
    public String edit(@ModelAttribute("user") User user,
                       Model model, @PathVariable("id") long id) {
        model.addAttribute("roles", roleService.findAll());
        model.addAttribute("user", userService.findById(id));
        return "adminView/editUser";
    }

    @PatchMapping("users/edit/{id}")
    public String update(@ModelAttribute("user") @Valid User user,
                         @ModelAttribute("userRoles") Long[] identity,
                         BindingResult bindingResult, @PathVariable("id") long id) {
        if (bindingResult.hasErrors()) {
            return "adminView/editUser";
        }
        if(identity != null) {
            for (Long roleId : identity) {
                user.addRoleInSet(roleService.findRoleById(roleId));
            }
        } else {
            user.addRoleInSet(roleService.findRoleById(2L));
        }
        userService.save(user);
        return "redirect:/admin/users";
    }

    @DeleteMapping("users/{id}")
    public String delete(@PathVariable("id") long id) {
        userService.deleteById(id);
        return "redirect:/admin/users";
    }
}


