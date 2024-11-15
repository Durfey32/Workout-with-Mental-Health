const CreateAccount = () => {
    return (
        <div>
        <h1>Create Account</h1>
        <form>
            <label>
            Email:
            <input type="email" name="email" />
            </label>
            <label>
            Password:
            <input type="password" name="password" />
            </label>
            <button type="submit">Create Account</button>
        </form>
        </div>
    );
};

export default CreateAccount;