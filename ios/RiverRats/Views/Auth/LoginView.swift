import SwiftUI

struct LoginView: View {
    @EnvironmentObject private var auth: AuthService
    @State private var email = ""
    @State private var password = ""
    @State private var isLoading = false
    @State private var errorMessage: String?
    @State private var showSignup = false

    var body: some View {
        NavigationStack {
            VStack(spacing: 24) {
                Spacer()

                VStack(spacing: 4) {
                    Text("🛶")
                        .font(.system(size: 56))
                    Text("River Rats")
                        .font(.largeTitle.bold())
                    Text("Find your crew. Run the river.")
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                }

                Spacer()

                VStack(spacing: 12) {
                    TextField("Email", text: $email)
                        .textContentType(.emailAddress)
                        .keyboardType(.emailAddress)
                        .autocapitalization(.none)
                        .textFieldStyle(.roundedBorder)

                    SecureField("Password", text: $password)
                        .textContentType(.password)
                        .textFieldStyle(.roundedBorder)

                    if let error = errorMessage {
                        Text(error)
                            .font(.caption)
                            .foregroundStyle(.red)
                    }

                    Button {
                        Task { await login() }
                    } label: {
                        Group {
                            if isLoading {
                                ProgressView()
                            } else {
                                Text("Sign In")
                                    .fontWeight(.semibold)
                            }
                        }
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 12)
                    }
                    .buttonStyle(.borderedProminent)
                    .disabled(isLoading || email.isEmpty || password.isEmpty)
                }
                .padding(.horizontal)

                Button("Don't have an account? Sign up") {
                    showSignup = true
                }
                .font(.footnote)

                Spacer()
            }
            .navigationDestination(isPresented: $showSignup) {
                SignupView()
            }
        }
    }

    private func login() async {
        isLoading = true
        errorMessage = nil
        do {
            try await auth.signIn(email: email, password: password)
        } catch {
            errorMessage = error.localizedDescription
        }
        isLoading = false
    }
}
