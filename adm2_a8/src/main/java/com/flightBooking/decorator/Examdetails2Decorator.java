package com.flightBooking.decorator;

import com.flightBooking.resource.Examdetails2;
import org.springframework.stereotype.Component;
import platform.decorator.BaseDecorator;
import platform.resource.BaseResource;
import platform.util.ApplicationException;
import platform.util.ExceptionSeverity;
import platform.webservice.ServletContext;

@Component
public class Examdetails2Decorator extends BaseDecorator {

    public Examdetails2Decorator() {
        super(new Examdetails2());
    }

    private void validateRollNo(Examdetails2 exam) throws ApplicationException {
        String rollNo = exam.getRollno();

        if (rollNo == null || rollNo.trim().isEmpty()) {
            throw new ApplicationException(ExceptionSeverity.ERROR, "Roll No cannot be empty");
        }

        if (!rollNo.matches("^\\d{11}$")) {
            throw new ApplicationException(ExceptionSeverity.ERROR, "Roll No must be exactly 11 digits");
        }
    }

    private void validateScore(Examdetails2 exam) throws ApplicationException {
        String scoreStr = exam.getScore();  // Assuming it's stored as a String

        if (scoreStr == null || scoreStr.trim().isEmpty()) {
            throw new ApplicationException(ExceptionSeverity.ERROR, "Score is required");
        }

        try {
            int score = Integer.parseInt(scoreStr.trim());
            if (score < 0 || score > 300) {
                throw new ApplicationException(ExceptionSeverity.ERROR, "Score must be between 0 and 300");
            }
        } catch (NumberFormatException e) {
            throw new ApplicationException(ExceptionSeverity.ERROR, "Score must be a valid number");
        }
    }

    @Override
    public void preAddDecorator(ServletContext stx, BaseResource _resource) throws ApplicationException {
        Examdetails2 exam = (Examdetails2) _resource;
        validateRollNo(exam);
        validateScore(exam);
    }

    @Override
    public void preModifyDecorator(ServletContext stx, BaseResource _resource) throws ApplicationException {
        Examdetails2 exam = (Examdetails2) _resource;
        validateRollNo(exam);
        validateScore(exam);
    }
}
