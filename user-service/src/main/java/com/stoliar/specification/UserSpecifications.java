package com.stoliar.specification;

import com.stoliar.entity.User;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

public class UserSpecifications {

    public static Specification<User> hasFirstName(String firstName) {
        return (root, query, criteriaBuilder) -> {
            if (!StringUtils.hasText(firstName)) {
                return criteriaBuilder.conjunction(); // пустое условие
            }
            return criteriaBuilder.like(
                criteriaBuilder.lower(root.get("name")),
                "%" + firstName.toLowerCase() + "%"
            );
        };
    }

    public static Specification<User> hasSurename(String surename) {
        return (root, query, criteriaBuilder) -> {
            if (!StringUtils.hasText(surename)) {
                return criteriaBuilder.conjunction(); // пустое условие
            }
            return criteriaBuilder.like(
                criteriaBuilder.lower(root.get("surename")),
                "%" + surename.toLowerCase() + "%"
            );
        };
    }

}