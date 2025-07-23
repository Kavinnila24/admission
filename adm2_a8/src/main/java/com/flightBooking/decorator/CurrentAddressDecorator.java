package com.flightBooking.decorator;

import com.flightBooking.resource.Currentaddress;
import org.springframework.stereotype.Component;
import platform.decorator.BaseDecorator;
import platform.resource.BaseResource;
import platform.util.ApplicationException;
import platform.util.ExceptionSeverity;
import platform.webservice.ServletContext;

@Component
public class CurrentAddressDecorator extends BaseDecorator {

    public CurrentAddressDecorator() {
        super(new Currentaddress());
    }

    private void validateCurrentAddress(Currentaddress address) throws ApplicationException {
        if (isEmpty(address.getLine1())) {
            throw new ApplicationException(ExceptionSeverity.ERROR, "Line 1 is required");
        }

        if (isEmpty(address.getCity())) {
            throw new ApplicationException(ExceptionSeverity.ERROR, "City is required");
        }

        if (isEmpty(address.getState())) {
            throw new ApplicationException(ExceptionSeverity.ERROR, "State is required");
        }

        if (isEmpty(address.getCountry())) {
            throw new ApplicationException(ExceptionSeverity.ERROR, "Country is required");
        }

        if (isEmpty(address.getPincode())) {
            throw new ApplicationException(ExceptionSeverity.ERROR, "Pincode is required");
        }

        String pincode = address.getPincode();
        if (pincode == null || pincode.length() < 5 || pincode.length() > 6) {
            throw new ApplicationException(ExceptionSeverity.ERROR, "Pincode must be 5 or 6 digits");
        }
    }

    private boolean isEmpty(String value) {
        return value == null || value.trim().isEmpty();
    }

    @Override
    public void preAddDecorator(ServletContext stx, BaseResource _resource) throws ApplicationException {
        Currentaddress address = (Currentaddress) _resource;
        validateCurrentAddress(address);
    }

    @Override
    public void preModifyDecorator(ServletContext stx, BaseResource _resource) throws ApplicationException {
        Currentaddress address = (Currentaddress) _resource;
        validateCurrentAddress(address);
    }
}
