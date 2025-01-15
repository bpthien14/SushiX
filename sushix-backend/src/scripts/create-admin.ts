import * as bcrypt from 'bcrypt';

async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt();
  return bcrypt.hash(password, salt);
}

async function main() {
  const password = '123456';
  const hashedPassword = await hashPassword(password);
  console.log('Hashed password:', hashedPassword);
  
  // In ra câu lệnh SQL để insert
  console.log(`
    INSERT INTO employees (
        first_name,
        last_name,
        email,
        password,
        role,
        birth_date,
        gender,
        phone,
        address,
        hire_date,
        current_branch_id,
        department_id,
        is_active
    ) VALUES (
        'Admin',
        'User',
        'admin@example.com',
        '${hashedPassword}',
        'SYSTEM_ADMIN',
        '1990-01-01',
        'Nam',
        '0987654321',
        'Địa chỉ admin',
        CURRENT_DATE,
        1,
        1,
        true
    );
  `);
}

main().catch(console.error); 