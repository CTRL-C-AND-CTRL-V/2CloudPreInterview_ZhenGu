"""create car table

Revision ID: ae110aac994e
Revises: 
Create Date: 2023-11-11 15:46:25.961057

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'ae110aac994e'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('cars',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('make', sa.String(), nullable=True),
        sa.Column('family', sa.String(), nullable=True),
        sa.Column('year', sa.Integer(), nullable=True),
        sa.Column('badges', sa.String(), nullable=True),
        sa.Column('bodyType', sa.String(), nullable=True),
        sa.Column('bodyTypeConfig', sa.String(), nullable=True),
        sa.Column('fuelType', sa.String(), nullable=True),
        sa.Column('transmission', sa.String(), nullable=True),
        sa.Column('engine', sa.Float(), nullable=True),
        sa.Column('cylidners', sa.Integer(), nullable=True),
        sa.Column('division', sa.String(), nullable=True),
        sa.Column('drive', sa.String(), nullable=True),
        sa.Column('seat', sa.Integer(), nullable=True),
        sa.Column('doors', sa.Integer(), nullable=True),
        sa.Column('odometer', sa.Integer(), nullable=True),
        sa.Column('state', sa.String(), nullable=True),
        sa.Column('saleCategory', sa.String(), nullable=True),
        sa.Column('saleDate', sa.String(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_cars_id'), 'cars', ['id'], unique=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_cars_id'), table_name='cars')
    op.drop_table('cars')
    # ### end Alembic commands ###