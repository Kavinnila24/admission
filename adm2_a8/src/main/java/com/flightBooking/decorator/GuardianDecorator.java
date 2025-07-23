package com.flightBooking.decorator;

import com.flightBooking.resource.Guardian;
import org.springframework.stereotype.Component;
import platform.decorator.BaseDecorator;
import platform.resource.BaseResource;
import platform.util.ApplicationException;
import platform.util.ExceptionSeverity;
import platform.webservice.ServletContext;
import java.util.regex.Pattern;
import java.util.regex.Matcher;

@Component
public class GuardianDecorator extends BaseDecorator {

    public GuardianDecorator() {
        super(new Guardian());
    }

    private void validateGuardian(Guardian guardian) throws ApplicationException {
        if (isEmpty(guardian.getName())) {
            throw new ApplicationException(ExceptionSeverity.ERROR, "Name is required");
        }

        if (isEmpty(guardian.getRelation())) {
            throw new ApplicationException(ExceptionSeverity.ERROR, "Relation is required");
        }

        if (isEmpty(guardian.getMobile())) {
            throw new ApplicationException(ExceptionSeverity.ERROR, "Mobile number is required");
        }

        if (!guardian.getMobile().matches("\\d{10}")) {
            throw new ApplicationException(ExceptionSeverity.ERROR, "Mobile number must be 10 digits");
        }

        if (!isEmpty(guardian.getEmail()) && !isValidEmail(guardian.getEmail())) {
            throw new ApplicationException(ExceptionSeverity.ERROR, "Invalid email format");
        }

    }

    private boolean isEmpty(String value) {
        return value == null || value.trim().isEmpty();
    }
    private boolean isValidEmail(String email) {
        String regex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(email);
        return matcher.matches();
    }
    @Override
    public void preAddDecorator(ServletContext stx, BaseResource _resource) throws ApplicationException {
        Guardian guardian = (Guardian) _resource;
        validateGuardian(guardian);
    }

    @Override
    public void preModifyDecorator(ServletContext stx, BaseResource _resource) throws ApplicationException {
        Guardian guardian = (Guardian) _resource;
        validateGuardian(guardian);
    }
}
