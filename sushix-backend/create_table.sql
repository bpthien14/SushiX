
-- Tạo ENUM cho role của nhân viên
CREATE TYPE employee_role_enum AS ENUM (
    'SYSTEM_ADMIN',    -- Quản trị viên hệ thống (cấp công ty)
    'BRANCH_MANAGER',  -- Quản lý chi nhánh
    'BRANCH_STAFF'     -- Nhân viên chi nhánh
);

-- 1. Quản lý Khu vực và Chi nhánh
CREATE TABLE areas (
    area_id SERIAL PRIMARY KEY,
    area_name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE branches (
    branch_id SERIAL PRIMARY KEY,
    area_id INTEGER REFERENCES areas(area_id),
    branch_name VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(20) NOT NULL,
    opening_time TIME NOT NULL,
    closing_time TIME NOT NULL,
    has_car_parking BOOLEAN DEFAULT false,
    has_motorbike_parking BOOLEAN DEFAULT false,
    is_delivery_supported BOOLEAN DEFAULT false,
    manager_id INTEGER, -- Will be updated after creating employees table
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Quản lý Thực đơn
CREATE TABLE menu_categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL,
    description TEXT,
    display_order INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE menu_items (
    item_id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES menu_categories(category_id),
    item_name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    is_deliverable BOOLEAN DEFAULT true,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE branch_menu_items (
    branch_id INTEGER REFERENCES branches(branch_id),
    item_id INTEGER REFERENCES menu_items(item_id),
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (branch_id, item_id)
);

-- 3. Quản lý Nhân viên
CREATE TABLE departments (
    department_id SERIAL PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL,  -- Bếp, lễ tân, phục vụ bàn, thu ngân...
    base_salary DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cập nhật bảng employees để hỗ trợ authentication
CREATE TABLE employees (
    employee_id SERIAL PRIMARY KEY,
    department_id INTEGER REFERENCES departments(department_id), -- Phân loại chức vụ cụ thể
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role employee_role_enum NOT NULL DEFAULT 'BRANCH_STAFF', -- Role phân quyền hệ thống
    birth_date DATE NOT NULL,
    gender VARCHAR(10) CHECK (gender IN ('Nam', 'Nữ', 'Khác')),
    phone VARCHAR(20) NOT NULL,
    address TEXT,
    hire_date DATE NOT NULL,
    termination_date DATE,
    current_branch_id INTEGER REFERENCES branches(branch_id),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng lưu refresh tokens
CREATE TABLE refresh_tokens (
    token_id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES employees(employee_id),
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(employee_id, token)
);

-- Bảng lưu lịch sử đăng nhập
CREATE TABLE login_history (
    history_id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES employees(employee_id),
    login_time TIMESTAMP NOT NULL,
    logout_time TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT,
    status VARCHAR(20) CHECK (status IN ('SUCCESS', 'FAILED')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE employee_branch_history (
    history_id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES employees(employee_id),
    branch_id INTEGER REFERENCES branches(branch_id),
    start_date DATE NOT NULL,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cập nhật foreign key manager_id trong bảng branches
ALTER TABLE branches 
ADD CONSTRAINT fk_branch_manager 
FOREIGN KEY (manager_id) REFERENCES employees(employee_id);

-- 4. Quản lý Khách hàng và Thẻ thành viên
CREATE TABLE membership_types (
    type_id SERIAL PRIMARY KEY,
    type_name VARCHAR(50) NOT NULL,
    min_points INTEGER NOT NULL,
    discount_percentage DECIMAL(5,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(100) UNIQUE,
    id_number VARCHAR(20) UNIQUE,
    gender VARCHAR(10) CHECK (gender IN ('Nam', 'Nữ', 'Khác')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng tài khoản khách hàng
CREATE TABLE customer_accounts (
    account_id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(customer_id),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng refresh token cho khách hàng
CREATE TABLE customer_refresh_tokens (
    token_id SERIAL PRIMARY KEY,
    account_id INTEGER REFERENCES customer_accounts(account_id),
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    is_revoked BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_active_token UNIQUE(account_id, token)
);

-- Bảng lịch sử đăng nhập của khách hàng
CREATE TABLE customer_login_history (
    history_id SERIAL PRIMARY KEY,
    account_id INTEGER REFERENCES customer_accounts(account_id),
    login_time TIMESTAMP NOT NULL,
    logout_time TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT,
    status VARCHAR(20) CHECK (status IN ('SUCCESS', 'FAILED')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE membership_cards (
    card_id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(customer_id),
    type_id INTEGER REFERENCES membership_types(type_id),
    card_number VARCHAR(50) UNIQUE NOT NULL,
    issue_date DATE NOT NULL,
    issued_by INTEGER REFERENCES employees(employee_id),
    points INTEGER DEFAULT 0,
    last_upgrade_date DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Quản lý Đơn hàng và Đánh giá
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    branch_id INTEGER REFERENCES branches(branch_id),
    customer_id INTEGER REFERENCES customers(customer_id),
    employee_id INTEGER REFERENCES employees(employee_id),
    card_id INTEGER REFERENCES membership_cards(card_id),
    order_date TIMESTAMP NOT NULL,
    table_number INTEGER,
    order_type VARCHAR(20) CHECK (order_type IN ('Dine-in', 'Takeaway', 'Delivery')),
    status VARCHAR(20) CHECK (status IN ('Pending', 'Confirmed', 'Completed', 'Cancelled')),
    subtotal DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    final_total DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_details (
    order_id INTEGER REFERENCES orders(order_id),
    item_id INTEGER REFERENCES menu_items(item_id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (order_id, item_id)
);

CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(order_id),
    service_rating INTEGER CHECK (service_rating BETWEEN 1 AND 5),
    location_rating INTEGER CHECK (location_rating BETWEEN 1 AND 5),
    food_quality_rating INTEGER CHECK (food_quality_rating BETWEEN 1 AND 5),
    price_rating INTEGER CHECK (price_rating BETWEEN 1 AND 5),
    ambience_rating INTEGER CHECK (ambience_rating BETWEEN 1 AND 5),
    comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Quản lý Đặt bàn Online
CREATE TABLE reservations (
    reservation_id SERIAL PRIMARY KEY,
    branch_id INTEGER REFERENCES branches(branch_id),
    customer_id INTEGER REFERENCES customers(customer_id),
    reservation_date DATE NOT NULL,
    reservation_time TIME NOT NULL,
    guest_count INTEGER NOT NULL,
    status VARCHAR(20) CHECK (status IN ('Pending', 'Confirmed', 'Completed', 'Cancelled')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reservation_items (
    reservation_id INTEGER REFERENCES reservations(reservation_id),
    item_id INTEGER REFERENCES menu_items(item_id),
    quantity INTEGER NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (reservation_id, item_id)
);

-- Tạo triggers để tự động cập nhật updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Áp dụng trigger cho tất cả các bảng
DO $$ 
DECLARE
    t text;
BEGIN
    FOR t IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
    LOOP
        EXECUTE format('CREATE TRIGGER update_updated_at_trigger
                       BEFORE UPDATE ON %I
                       FOR EACH ROW
                       EXECUTE FUNCTION update_updated_at_column()', t);
    END LOOP;
END $$;

-- Insert dữ liệu mẫu cho bảng membership_types
INSERT INTO membership_types (type_name, min_points, discount_percentage) VALUES
('Member', 0, 0),
('Silver', 50, 5),
('Gold', 100, 10);

-- 1. Thêm dữ liệu cho areas
INSERT INTO areas (area_name, description) VALUES
('Hồ Chí Minh', 'Khu vực thành phố Hồ Chí Minh'),
('Hà Nội', 'Khu vực thành phố Hà Nội'),
('Đà Nẵng', 'Khu vực thành phố Đà Nẵng');

-- 2. Thêm dữ liệu cho menu_categories
INSERT INTO menu_categories (category_name, description, display_order) VALUES
('Khai vị', 'Các món khai vị', 1),
('Sashimi combo', 'Các set combo cá sống', 2),
('Nigiri', 'Các loại cơm cuộn', 3),
('Tempura', 'Các món chiên', 4),
('Udon', 'Các món mì Udon', 5);

-- 3. Thêm dữ liệu cho departments
INSERT INTO departments (department_name, base_salary) VALUES
('Bếp', 8000000),
('Lễ tân', 6000000),
('Phục vụ bàn', 5000000),
('Thu ngân', 7000000),
('Quản lý', 12000000);

-- Function tính doanh thu theo chi nhánh
CREATE OR REPLACE FUNCTION calculate_branch_revenue(
    branch_id_param INTEGER,
    start_date DATE,
    end_date DATE
)
RETURNS TABLE (
    total_revenue DECIMAL(10,2),
    order_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(SUM(final_total), 0) as total_revenue,
        COUNT(*) as order_count
    FROM orders
    WHERE branch_id = branch_id_param
    AND DATE(order_date) BETWEEN start_date AND end_date
    AND status = 'Completed';
END;
$$ LANGUAGE plpgsql;

-- Function cập nhật điểm thành viên
CREATE OR REPLACE FUNCTION update_membership_points()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'Completed' AND NEW.card_id IS NOT NULL THEN
        UPDATE membership_cards
        SET points = points + FLOOR(NEW.final_total / 100000)
        WHERE card_id = NEW.card_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger cập nhật điểm thành viên sau khi hoàn thành đơn hàng
CREATE TRIGGER update_points_after_order
AFTER UPDATE ON orders
FOR EACH ROW
WHEN (OLD.status != 'Completed' AND NEW.status = 'Completed')
EXECUTE FUNCTION update_membership_points();

-- Trigger kiểm tra và nâng hạng thẻ thành viên
CREATE OR REPLACE FUNCTION check_membership_upgrade()
RETURNS TRIGGER AS $$
BEGIN
    -- Kiểm tra điều kiện nâng cấp lên Silver
    IF NEW.points >= 50 AND OLD.type_id = 1 THEN
        NEW.type_id := 2;
        NEW.last_upgrade_date := CURRENT_DATE;
    -- Kiểm tra điều kiện nâng cấp lên Gold
    ELSIF NEW.points >= 100 AND OLD.type_id = 2 THEN
        NEW.type_id := 3;
        NEW.last_upgrade_date := CURRENT_DATE;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_membership_upgrade_trigger
BEFORE UPDATE ON membership_cards
FOR EACH ROW
EXECUTE FUNCTION check_membership_upgrade();

-- View thống kê doanh thu theo chi nhánh
CREATE VIEW branch_revenue_summary AS
SELECT 
    b.branch_id,
    b.branch_name,
    COUNT(o.order_id) as total_orders,
    SUM(o.final_total) as total_revenue,
    AVG(r.service_rating) as avg_service_rating
FROM branches b
LEFT JOIN orders o ON b.branch_id = o.branch_id
LEFT JOIN reviews r ON o.order_id = r.order_id
GROUP BY b.branch_id, b.branch_name;

-- View thông tin khách hàng VIP
CREATE VIEW vip_customers AS
SELECT 
    c.customer_id,
    c.full_name,
    mc.card_number,
    mt.type_name,
    mc.points,
    COUNT(o.order_id) as total_orders,
    SUM(o.final_total) as total_spent
FROM customers c
JOIN membership_cards mc ON c.customer_id = mc.customer_id
JOIN membership_types mt ON mc.type_id = mt.type_id
LEFT JOIN orders o ON c.customer_id = o.customer_id
WHERE mt.type_id > 1
GROUP BY c.customer_id, c.full_name, mc.card_number, mt.type_name, mc.points;

-- Index cho tìm kiếm khách hàng
CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_customers_email ON customers(email);

-- Index cho tra cứu đơn hàng
CREATE INDEX idx_orders_date ON orders(order_date);
CREATE INDEX idx_orders_status ON orders(status);

-- Index cho thống kê doanh thu
CREATE INDEX idx_orders_branch_date ON orders(branch_id, order_date);

-- Tạo role cho nhân viên
--CREATE ROLE branch_staff;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO branch_staff;
GRANT INSERT, UPDATE ON orders, order_details TO branch_staff;

-- Tạo role cho quản lý chi nhánh
--CREATE ROLE branch_manager;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO branch_manager;

-- Tạo role cho admin
--CREATE ROLE system_admin;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO system_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO system_admin;

-- Procedure tạo đơn hàng mới
CREATE OR REPLACE PROCEDURE create_new_order(
    p_branch_id INT,
    p_customer_id INT,
    p_employee_id INT,
    p_card_id INT,
    p_table_number INT,
    p_order_type VARCHAR
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_order_id INT;
BEGIN
    INSERT INTO orders (
        branch_id, customer_id, employee_id, card_id,
        order_date, table_number, order_type, status,
        subtotal, final_total
    ) VALUES (
        p_branch_id, p_customer_id, p_employee_id, p_card_id,
        CURRENT_TIMESTAMP, p_table_number, p_order_type, 'Pending',
        0, 0
    ) RETURNING order_id INTO v_order_id;
    
    -- Trả về order_id để sử dụng
    RAISE NOTICE 'Created order ID: %', v_order_id;
END;
$$;

-- Procedure đăng ký thẻ thành viên mới
CREATE OR REPLACE PROCEDURE register_new_member(
    p_customer_id INT,
    p_issued_by INT,
    OUT p_card_number VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Tạo số thẻ ngẫu nhiên
    p_card_number := 'MEM' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || LPAD(FLOOR(RANDOM() * 1000)::TEXT, 3, '0');
    
    INSERT INTO membership_cards (
        customer_id,
        type_id,
        card_number,
        issue_date,
        issued_by,
        points
    ) VALUES (
        p_customer_id,
        1, -- Member level
        p_card_number,
        CURRENT_DATE,
        p_issued_by,
        0
    );
END;
$$;

-- Function thống kê doanh thu theo khoảng thời gian và chi nhánh
CREATE OR REPLACE FUNCTION get_revenue_report(
    p_start_date DATE,
    p_end_date DATE,
    p_branch_id INTEGER DEFAULT NULL
)
RETURNS TABLE (
    branch_name VARCHAR,
    total_orders BIGINT,
    total_revenue DECIMAL(10,2),
    avg_order_value DECIMAL(10,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        b.branch_name,
        COUNT(o.order_id),
        COALESCE(SUM(o.final_total), 0),
        COALESCE(AVG(o.final_total), 0)
    FROM branches b
    LEFT JOIN orders o ON b.branch_id = o.branch_id
    WHERE (p_branch_id IS NULL OR b.branch_id = p_branch_id)
    AND (o.order_date IS NULL OR DATE(o.order_date) BETWEEN p_start_date AND p_end_date)
    AND (o.status = 'Completed' OR o.status IS NULL)
    GROUP BY b.branch_id, b.branch_name;
END;
$$ LANGUAGE plpgsql;

-- Function thống kê món ăn bán chạy
CREATE OR REPLACE FUNCTION get_popular_items(
    p_start_date DATE,
    p_end_date DATE,
    p_branch_id INTEGER DEFAULT NULL,
    p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
    item_name VARCHAR,
    category_name VARCHAR,
    total_quantity BIGINT,
    total_revenue DECIMAL(10,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        mi.item_name,
        mc.category_name,
        SUM(od.quantity) as total_quantity,
        SUM(od.subtotal) as total_revenue
    FROM order_details od
    JOIN menu_items mi ON od.item_id = mi.item_id
    JOIN menu_categories mc ON mi.category_id = mc.category_id
    JOIN orders o ON od.order_id = o.order_id
    WHERE (p_branch_id IS NULL OR o.branch_id = p_branch_id)
    AND DATE(o.order_date) BETWEEN p_start_date AND p_end_date
    AND o.status = 'Completed'
    GROUP BY mi.item_id, mi.item_name, mc.category_name
    ORDER BY total_quantity DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Function kiểm tra và cập nhật hạng thẻ thành viên
CREATE OR REPLACE FUNCTION check_and_update_membership_level()
RETURNS TRIGGER AS $$
DECLARE
    v_last_upgrade_date DATE;
    v_total_points INTEGER;
BEGIN
    -- Lấy thông tin thẻ
    SELECT last_upgrade_date, points 
    INTO v_last_upgrade_date, v_total_points
    FROM membership_cards 
    WHERE card_id = NEW.card_id;

    -- Nếu là thẻ Silver
    IF NEW.type_id = 2 THEN
        -- Kiểm tra điều kiện giữ hạng
        IF v_last_upgrade_date IS NOT NULL 
        AND v_last_upgrade_date + INTERVAL '1 year' <= CURRENT_DATE 
        AND v_total_points < 50 THEN
            -- Xuống hạng Member
            NEW.type_id := 1;
            NEW.last_upgrade_date := NULL;
        -- Kiểm tra điều kiện lên Gold
        ELSIF v_total_points >= 100 THEN
            NEW.type_id := 3;
            NEW.last_upgrade_date := CURRENT_DATE;
        END IF;
    -- Nếu là thẻ Gold
    ELSIF NEW.type_id = 3 THEN
        -- Kiểm tra điều kiện giữ hạng
        IF v_last_upgrade_date IS NOT NULL 
        AND v_last_upgrade_date + INTERVAL '1 year' <= CURRENT_DATE 
        AND v_total_points < 100 THEN
            -- Xuống hạng Silver
            NEW.type_id := 2;
            NEW.last_upgrade_date := CURRENT_DATE;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger cho việc kiểm tra và cập nhật hạng thẻ
CREATE TRIGGER check_membership_level_trigger
BEFORE UPDATE OF points ON membership_cards
FOR EACH ROW
EXECUTE FUNCTION check_and_update_membership_level();

-- Function tính điểm đánh giá trung bình của nhân viên
CREATE OR REPLACE FUNCTION get_employee_ratings(
    p_start_date DATE,
    p_end_date DATE,
    p_branch_id INTEGER DEFAULT NULL
)
RETURNS TABLE (
    employee_name VARCHAR,
    total_orders BIGINT,
    avg_service_rating DECIMAL(3,2),
    total_revenue DECIMAL(10,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.full_name,
        COUNT(DISTINCT o.order_id),
        COALESCE(AVG(r.service_rating), 0),
        COALESCE(SUM(o.final_total), 0)
    FROM employees e
    LEFT JOIN orders o ON e.employee_id = o.employee_id
    LEFT JOIN reviews r ON o.order_id = r.order_id
    WHERE (p_branch_id IS NULL OR e.current_branch_id = p_branch_id)
    AND (o.order_date IS NULL OR DATE(o.order_date) BETWEEN p_start_date AND p_end_date)
    GROUP BY e.employee_id, e.full_name;
END;
$$ LANGUAGE plpgsql;

-- Procedure cập nhật trạng thái đơn hàng
CREATE OR REPLACE PROCEDURE update_order_status(
    p_order_id INTEGER,
    p_new_status VARCHAR,
    p_employee_id INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Kiểm tra quyền của nhân viên
    IF NOT EXISTS (
        SELECT 1 FROM employees e 
        WHERE e.employee_id = p_employee_id 
        AND e.department_id IN (4,5) -- Thu ngân hoặc Quản lý
    ) THEN
        RAISE EXCEPTION 'Không có quyền cập nhật trạng thái đơn hàng';
    END IF;

    -- Cập nhật trạng thái
    UPDATE orders 
    SET status = p_new_status,
        updated_at = CURRENT_TIMESTAMP
    WHERE order_id = p_order_id;

    -- Ghi log
    RAISE NOTICE 'Đơn hàng % đã được cập nhật thành %', p_order_id, p_new_status;
END;
$$;

-- Procedure xử lý đặt bàn
CREATE OR REPLACE PROCEDURE process_reservation(
    p_reservation_id INTEGER,
    p_status VARCHAR,
    p_employee_id INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Kiểm tra quyền của nhân viên
    IF NOT EXISTS (
        SELECT 1 FROM employees e 
        WHERE e.employee_id = p_employee_id 
        AND e.department_id IN (2,5) -- Lễ tân hoặc Quản lý
    ) THEN
        RAISE EXCEPTION 'Không có quyền xử lý đặt bàn';
    END IF;

    -- Cập nhật trạng thái đặt bàn
    UPDATE reservations 
    SET status = p_status,
        updated_at = CURRENT_TIMESTAMP
    WHERE reservation_id = p_reservation_id;

    -- Ghi log
    RAISE NOTICE 'Đặt bàn % đã được cập nhật thành %', p_reservation_id, p_status;
END;
$$;

-- Các index
CREATE INDEX idx_employees_email ON employees(email);
CREATE INDEX idx_employees_role ON employees(role);
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);
CREATE INDEX idx_login_history_employee ON login_history(employee_id, login_time);
CREATE INDEX idx_refresh_tokens_lookup ON customer_refresh_tokens(token, is_revoked);

