package com.flightBooking.decorator;

import com.flightBooking.resource.Educationdetails;
import org.springframework.stereotype.Component;
import platform.decorator.BaseDecorator;
import platform.resource.BaseResource;
import platform.util.ApplicationException;
import platform.util.ExceptionSeverity;
import platform.webservice.ServletContext;

import java.time.Year;

@Component
public class EducationdetailsDecorator extends BaseDecorator {

    public EducationdetailsDecorator() {
        super(new Educationdetails());
    }

    private void validateEducation(Educationdetails edu) throws ApplicationException {
        if (isEmpty(edu.getLevel())) {
            throw new ApplicationException(ExceptionSeverity.ERROR, "Level is required");
        }

        if (isEmpty(edu.getBoard())) {
            throw new ApplicationException(ExceptionSeverity.ERROR, "Education Board is required");
        }

        if (isEmpty(edu.getSpecialization())) {
            throw new ApplicationException(ExceptionSeverity.ERROR, "Specialization is required");
        }

        if (isEmpty(edu.getSchoolname())) {
            throw new ApplicationException(ExceptionSeverity.ERROR, "School/College name is required");
        }

        if (isEmpty(edu.getGrading())) {
            throw new ApplicationException(ExceptionSeverity.ERROR, "Grading type is required");
        }

        if (edu.getPassingyear() == null) {
            throw new ApplicationException(ExceptionSeverity.ERROR, "Year of Passing is required");
        }

        String passingYearStr = edu.getPassingyear();

        if (isEmpty(passingYearStr)) {
            throw new ApplicationException(ExceptionSeverity.ERROR, "Year of Passing is required");
        }

        try {
            int passingYear = Integer.parseInt(passingYearStr.trim());
            int currentYear = Year.now().getValue();

            if (passingYear > currentYear) {
                throw new ApplicationException(ExceptionSeverity.ERROR, "Year of Passing cannot be in the future");
            }
        } catch (NumberFormatException e) {
            throw new ApplicationException(ExceptionSeverity.ERROR, "Year of Passing must be a valid number");
        }


        if (isEmpty(edu.getMarksobtained())) {
            throw new ApplicationException(ExceptionSeverity.ERROR, "Proof of Education is required");
        }
    }

    private boolean isEmpty(String value) {
        return value == null || value.trim().isEmpty();
    }

    @Override
    public void preAddDecorator(ServletContext stx, BaseResource _resource) throws ApplicationException {
        Educationdetails edu = (Educationdetails) _resource;
        validateEducation(edu);
    }

    @Override
    public void preModifyDecorator(ServletContext stx, BaseResource _resource) throws ApplicationException {
        Educationdetails edu = (Educationdetails) _resource;
        validateEducation(edu);
    }
}
