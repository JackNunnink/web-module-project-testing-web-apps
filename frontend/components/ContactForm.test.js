import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import ContactForm from './ContactForm';

test('renders without errors', () => {
    render(<ContactForm />);
});

test('renders the contact form header', () => {
    render(<ContactForm />);
    const header = screen.getByText(/contact form/i);
    expect(header).toBeInTheDocument();
    expect(header).toBeTruthy();
    expect(header).toHaveTextContent(/contact form/i);
});

test('renders ONE error message if user enters less then 3 characters into firstname.', async () => {
    render(<ContactForm />);

    const firstNameInput = screen.getByLabelText(/First Name/i);
    userEvent.type(firstNameInput, 'A');

    const errorMessage = await screen.findAllByTestId('error');
    expect(errorMessage).toHaveLength(1);
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    render(<ContactForm />);

    const submitButton = screen.getByRole("button");
    userEvent.click(submitButton);

    await waitFor(() => {
        const errorMessages = screen.queryAllByTestId("error");
        expect(errorMessages).toHaveLength(3);
    });
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    render(<ContactForm />);

    const firstNameInput = screen.getByLabelText(/First Name/i);
    userEvent.type(firstNameInput, 'Jack');

    const lastNameInput = screen.getByLabelText(/Last Name/i);
    userEvent.type(lastNameInput, 'Nunnink');

    const submitButton = screen.getByRole("button");
    userEvent.click(submitButton);

    const errorMessages = await screen.findAllByTestId("error");
    expect(errorMessages).toHaveLength(1);
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    render(<ContactForm />);

    const emailField = screen.getByLabelText(/email/i);
    userEvent.type(emailField, "jack");

    const errorMessage = await screen.findByText(/email must be a valid email address/i);
    expect(errorMessage).toBeInTheDocument();
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    render(<ContactForm />);

    const firstNameInput = screen.getByLabelText(/First Name/i);
    userEvent.type(firstNameInput, 'Jack');

    const emailField = screen.getByLabelText(/email/i);
    userEvent.type(emailField, "asdf@asdf.com");

    const submitButton = screen.getByRole("button");
    userEvent.click(submitButton);

    const errorMessage = await screen.findByText(/lastName is a required field/i);
    expect(errorMessage).toBeInTheDocument();
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    render(<ContactForm />);

    const firstNameInput = screen.getByLabelText(/First Name/i);
    userEvent.type(firstNameInput, 'Jack');

    const lastNameInput = screen.getByLabelText(/Last Name/i);
    userEvent.type(lastNameInput, 'Nunnink');

    const emailField = screen.getByLabelText(/email/i);
    userEvent.type(emailField, "asdf@asdf.com");

    const submitButton = screen.getByRole("button");
    userEvent.click(submitButton);

    await waitFor(() => {
        const firstNameDisplay = screen.queryByText(/Jack/i);
        expect(firstNameDisplay).toBeInTheDocument();

        const lastNameDisplay = screen.queryByText(/Nunnink/i);
        expect(lastNameDisplay).toBeInTheDocument();

        const emailDisplay = screen.queryByText(/asdf@asdf.com/i);
        expect(emailDisplay).toBeInTheDocument();

        const messageDisplay = screen.queryByTestId("messageDisplay");
        expect(messageDisplay).not.toBeInTheDocument();
    });
});

test('renders all fields text when all fields are submitted.', async () => {
    render(<ContactForm />);

    const firstNameInput = screen.getByLabelText(/First Name/i);
    userEvent.type(firstNameInput, 'Jack');

    const lastNameInput = screen.getByLabelText(/Last Name/i);
    userEvent.type(lastNameInput, 'Nunnink');

    const emailField = screen.getByLabelText(/email/i);
    userEvent.type(emailField, "asdf@asdf.com");

    const submitButton = screen.getByRole("button");
    userEvent.click(submitButton);

    const messageInput = screen.getByLabelText(/message/i);
    userEvent.type(messageInput, "This sucks");

    await waitFor(() => {
        const firstNameDisplay = screen.queryByText(/Jack/i);
        expect(firstNameDisplay).toBeInTheDocument();

        const lastNameDisplay = screen.queryByText(/Nunnink/i);
        expect(lastNameDisplay).toBeInTheDocument();

        const emailDisplay = screen.queryByText(/asdf@asdf.com/i);
        expect(emailDisplay).toBeInTheDocument();

        const messageDisplay = screen.queryByText("This sucks");
        expect(messageDisplay).toBeInTheDocument();
    });
});
