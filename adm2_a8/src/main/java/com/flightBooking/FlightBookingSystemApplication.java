package com.flightBooking;

import com.flightBooking.decorator.*;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import platform.decorator.DecoratorManager;
import platform.defined.account.helper.RoleHelper;
import platform.helper.HelperManager;

@SpringBootApplication
@ComponentScan(basePackages = {"controller", "platform.webservice.map", "platform.webservice.controller.base","ci","com.flightBooking","platform.defined.account.controller"})

public class FlightBookingSystemApplication {

    public static void main(String[] args) {
        Registry.register();
        //Decorator files
        DecoratorManager.getInstance().register(new CurrentAddressDecorator());
        DecoratorManager.getInstance().register(new GuardianDecorator());
        DecoratorManager.getInstance().register(new ExamdetailsDecorator());
        DecoratorManager.getInstance().register(new Examdetails2Decorator());
        DecoratorManager.getInstance().register(new EducationdetailsDecorator());
        DecoratorManager.getInstance().register(new Educationdetails2Decorator());



        HelperManager.getInstance().register(RoleHelper.getInstance());
        SpringApplication.run(FlightBookingSystemApplication.class, args);

    }

}
