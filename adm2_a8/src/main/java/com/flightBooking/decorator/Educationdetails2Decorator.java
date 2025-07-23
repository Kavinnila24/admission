package com.flightBooking.decorator;

import com.flightBooking.resource.Educationdetails2;
import org.springframework.stereotype.Component;
import platform.decorator.BaseDecorator;
import platform.resource.BaseResource;
import platform.util.ApplicationException;
import platform.util.ExceptionSeverity;
import platform.webservice.ServletContext;

import java.time.Year;

@Component
public class Educationdetails2Decorator extends BaseDecorator {

    public Educationdetails2Decorator() {
        super(new Educationdetails2());
    }

    private boolean isEmpty(String value) {
        return value == null || value.trim().isEmpty();
    }

    private void validateRequiredFields(Educationdetails2 edu) throws ApplicationException {
        if (isEmpty(edu.getLevel())) {
            throw new ApplicationException(ExceptionSeverity.ERROR, "Education level is required");
        }

        if (isEmpty(edu.getBoard())) {
            throw new ApplicationException(ExceptionSeverity.ERROR, "Board is required");
        }

        if (isEmpty(edu.getSpecialization())) {
            throw new ApplicationException(ExceptionSeverity.ERROR, "Specialization is required");
        }

        if (isEmpty(edu.getSchoolname())) {
            throw new ApplicationException(ExceptionSeverity.ERROR, "School name is required");
        }

        if (isEmpty(edu.getGrading())) {
            throw new ApplicationException(ExceptionSeverity.ERROR, "Grading system is required");
        }

        if (isEmpty(edu.getPassingyear())) {
            throw new ApplicationException(ExceptionSeverity.ERROR, "Year of Passing is required");
        }

        if (isEmpty(edu.getMarksobtained())) {
            throw new ApplicationException(ExceptionSeverity.ERROR, "Marks/Proof is required");
        }
    }

    private void validatePassingYear(Educationdetails2 edu) throws ApplicationException {
        try {
            int passingYear = Integer.parseInt(edu.getPassingyear().trim());
            int currentYear = Year.now().getValue();

            if (passingYear > currentYear) {
                throw new ApplicationException(ExceptionSeverity.ERROR, "Year of Passing cannot be in the future");
            }
        } catch (NumberFormatException e) {
            throw new ApplicationException(ExceptionSeverity.ERROR, "Year of Passing must be a valid number");
        }
    }

    @Override
    public void preAddDecorator(ServletContext stx, BaseResource _resource) throws ApplicationException {
        Educationdetails2 edu = (Educationdetails2) _resource;

        validateRequiredFields(edu);
        validatePassingYear(edu);
    }

    @Override
    public void preModifyDecorator(ServletContext stx, BaseResource _resource) throws ApplicationException {
        preAddDecorator(stx, _resource);
    }
}
