package com.rasp.app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import platform.decorator.DecoratorManager;

@SpringBootApplication
@ComponentScan(basePackages = {"com.rasp.app.controller","controller", "platform.webservice.map", "platform.webservice.controller.base", "com.rasp.app.config", "platform.defined.account.controller", "com.rasp.app.service"})

public class Application {
	public static void main(String[] args) {
		Registry.register();
		DecoratorManager.getInstance().register("user",new com.rasp.app.decorator.UserDecorator());
		SpringApplication.run(Application.class, args);
	}
}
