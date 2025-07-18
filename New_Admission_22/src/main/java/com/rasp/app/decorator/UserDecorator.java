package com.rasp.app.decorator;

import com.rasp.app.helper.UserHelper;
import com.rasp.app.resource.User;
import platform.db.Expression;
import platform.db.REL_OP;
import platform.decorator.BaseDecorator;
import platform.resource.BaseResource;
import platform.util.ApplicationException;
import platform.util.ExceptionSeverity;
import platform.util.Util;
import platform.webservice.BaseService;
import platform.webservice.ServletContext;

import java.util.Map;
import java.util.Objects;

public class UserDecorator extends BaseDecorator {
    public UserDecorator(){
        super(new User());
    }

    // @Override
    // public void preAddDecorator (ServletContext stx, BaseResource _resource) throws ApplicationException {
    //     User User = (User) _resource;
    //     BaseResource[] Users = UserHelper.getInstance().getAll();
    //     for (BaseResource baseRes : Users) {
    //         User stu = (User) baseRes;
    //         if (Objects.equals(User.getEmail(), stu.getEmail())) {
    //             throw new ApplicationException(ExceptionSeverity.ERROR, "Email already present");
    //         }
    //     }
    // }

    @Override
    public BaseResource[] getQuery(ServletContext ctx, String queryId, Map<String, Object> map, BaseService service) throws ApplicationException{
        System.out.println("HI");
        if ("GET_USER_BY_EMAIL".equalsIgnoreCase(queryId)){
            System.out.println(map);
            String email = (String) map.get(User.FIELD_EMAIL);
            if (Util.isEmpty(email)){
                throw new ApplicationException(ExceptionSeverity.ERROR, "Email not found!");
            }
            Expression e = new Expression(User.FIELD_EMAIL, REL_OP.EQ, email);
            return UserHelper.getInstance().getByExpression(e);
        }
        return super.getQuery(ctx, queryId, map, service);
    }
}