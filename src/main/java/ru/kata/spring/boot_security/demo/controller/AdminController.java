package ru.kata.spring.boot_security.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.UserService;

import javax.validation.Valid;
import java.security.Principal;

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
    public String adminPage(Principal principal, Model model) {
        User user = userService.findByUsername(principal.getName());
        model.addAttribute("user", user);
        model.addAttribute("users", userService.findAll());
        model.addAttribute("roles", roleService.findAll());
        model.addAttribute("newUser", new User());
        return "admin";
    }

    @PostMapping("/createUser")
    public String create(@ModelAttribute("newUser") @Valid User user,
                         @ModelAttribute("userRoles") Long[] identity,
                         BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return "admin";
        }
        if(identity != null) {
            for (Long roleId : identity) {
                user.addRoleInSet(roleService.findRoleById(roleId));
            }
        } else {
            user.addRoleInSet(roleService.findRoleById(2L));
        }
        userService.save(user);
        return "redirect:/admin";
    }

    @PatchMapping("/{id}")
    public String update(@ModelAttribute("newUser") @Valid User user,
                         @ModelAttribute("userRoles") Long[] identity,
                         BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return "admin";
        }
        if(identity != null) {
            for (Long roleId : identity) {
                user.addRoleInSet(roleService.findRoleById(roleId));
            }
        } else {
            user.addRoleInSet(roleService.findRoleById(2L));
        }
        userService.save(user);
        return "redirect:/admin";
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable("id") long id) {
        userService.deleteById(id);
        return "redirect:/admin";
    }
}


