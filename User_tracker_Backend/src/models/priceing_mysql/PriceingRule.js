module.exports = (sequelize, DataTypes) => {
    const PriceingRule = sequelize.define(
        "PriceingRule",
        {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true
            },
            client_code: {
                type: DataTypes.STRING,
                allowNull: false
            },
            client_id: {
                type: DataTypes.STRING,
                allowNull: false
            },
            created_by: { type: DataTypes.STRING },
            active: {
                type: DataTypes.BOOLEAN,
                defaultValue: true
            },

            rule_name: {
                type: DataTypes.STRING(255),
                allowNull: false
            },

            description: {
                type: DataTypes.TEXT
            },

            apply_to: {
                type: DataTypes.STRING(50)
            },

            or_rules: {
                type: DataTypes.JSON,
                allowNull: false
            },

            then_actions: {
                type: DataTypes.JSON,
                allowNull: false
            },

            with_limits_guardrails: {
                type: DataTypes.JSON
            },

            schedule: {
                type: DataTypes.JSON
            },

            is_delete: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            }
        },
        {
            tableName: "priceing_rules",
            timestamps: true,
            underscored: true
        }
    );

    return PriceingRule;
};
