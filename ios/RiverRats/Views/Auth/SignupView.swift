import SwiftUI

struct SignupView: View {
    @EnvironmentObject private var auth: AuthService
    @Environment(\.dismiss) private var dismiss
    @State private var email = ""
    @State private var password = ""
    @State private var confirmPassword = ""
    @State private var isLoading = false
    @State private var errorMessage: String?

    private var validationError: String? {
        if password.count < 6 { return "Password must be at least 6 characters" }
        if password != confirmPassword { return "Passwords don't match" }
        return nil
    }

    var body: some View {
        VStack(spacing: 24) {
            Spacer()

            Text("Create Account")
                .font(.title.bold())

            VStack(spacing: 12) {
                TextField("Email", text: $email)
                    .textContentType(.emailAddress)
                    .keyboardType(.emailAddress)
                    .autocapitalization(.none)
                    .textFieldStyle(.roundedBorder)

                SecureField("Password", text: $password)
                    .textContentType(.newPassword)
                    .textFieldStyle(.roundedBorder)

                SecureField("Confirm Password", text: $confirmPassword)
                    .textContentType(.newPassword)
                    .textFieldStyle(.roundedBorder)

                if let error = errorMessage ?? validationError, !error.isEmpty,
                   (!password.isEmpty || !confirmPassword.isEmpty) {
                    Text(errorMessage ?? (validationError ?? ""))
                        .font(.caption)
                        .foregroundStyle(.red)
                }

                Button {
                    Task { await signUp() }
                } label: {
                    Group {
                        if isLoading {
                            ProgressView()
                        } else {
                            Text("Create Account")
                                .fontWeight(.semibold)
                        }
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 12)
                }
                .buttonStyle(.borderedProminent)
                .disabled(isLoading || email.isEmpty || validationError != nil)
            }
            .padding(.horizontal)

            Spacer()
        }
        .navigationTitle("Sign Up")
        .navigationBarTitleDisplayMode(.inline)
    }

    private func signUp() async {
        isLoading = true
        errorMessage = nil
        do {
            try await auth.signUp(email: email, password: password)
        } catch {
            errorMessage = error.localizedDescription
        }
        isLoading = false
    }
}
