import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
// tslint:disable-next-line:no-unused-variable
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IProduct } from 'app/shared/model/product/product.model';
import { getEntities as getProducts } from 'app/entities/product/product/product.reducer';
import { IProductOrder } from 'app/shared/model/product/product-order.model';
import { getEntities as getProductOrders } from 'app/entities/product/product-order/product-order.reducer';
import { getEntity, updateEntity, createEntity, reset } from './order-item.reducer';
import { IOrderItem } from 'app/shared/model/product/order-item.model';
// tslint:disable-next-line:no-unused-variable
import { convertDateTimeFromServer, convertDateTimeToServer } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IOrderItemUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export interface IOrderItemUpdateState {
  isNew: boolean;
  productId: string;
  orderId: string;
}

export class OrderItemUpdate extends React.Component<IOrderItemUpdateProps, IOrderItemUpdateState> {
  constructor(props) {
    super(props);
    this.state = {
      productId: '0',
      orderId: '0',
      isNew: !this.props.match.params || !this.props.match.params.id
    };
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.updateSuccess !== this.props.updateSuccess && nextProps.updateSuccess) {
      this.handleClose();
    }
  }

  componentDidMount() {
    if (this.state.isNew) {
      this.props.reset();
    } else {
      this.props.getEntity(this.props.match.params.id);
    }

    this.props.getProducts();
    this.props.getProductOrders();
  }

  saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const { orderItemEntity } = this.props;
      const entity = {
        ...orderItemEntity,
        ...values
      };

      if (this.state.isNew) {
        this.props.createEntity(entity);
      } else {
        this.props.updateEntity(entity);
      }
    }
  };

  handleClose = () => {
    this.props.history.push('/entity/order-item');
  };

  render() {
    const { orderItemEntity, products, productOrders, loading, updating } = this.props;
    const { isNew } = this.state;

    return (
      <div>
        <Row className="justify-content-center">
          <Col md="8">
            <h2 id="storeApp.productOrderItem.home.createOrEditLabel">
              <Translate contentKey="storeApp.productOrderItem.home.createOrEditLabel">Create or edit a OrderItem</Translate>
            </h2>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="8">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <AvForm model={isNew ? {} : orderItemEntity} onSubmit={this.saveEntity}>
                {!isNew ? (
                  <AvGroup>
                    <Label for="order-item-id">
                      <Translate contentKey="global.field.id">ID</Translate>
                    </Label>
                    <AvInput id="order-item-id" type="text" className="form-control" name="id" required readOnly />
                  </AvGroup>
                ) : null}
                <AvGroup>
                  <Label id="quantityLabel" for="order-item-quantity">
                    <Translate contentKey="storeApp.productOrderItem.quantity">Quantity</Translate>
                  </Label>
                  <AvField
                    id="order-item-quantity"
                    type="string"
                    className="form-control"
                    name="quantity"
                    validate={{
                      required: { value: true, errorMessage: translate('entity.validation.required') },
                      min: { value: 0, errorMessage: translate('entity.validation.min', { min: 0 }) },
                      number: { value: true, errorMessage: translate('entity.validation.number') }
                    }}
                  />
                </AvGroup>
                <AvGroup>
                  <Label id="totalPriceLabel" for="order-item-totalPrice">
                    <Translate contentKey="storeApp.productOrderItem.totalPrice">Total Price</Translate>
                  </Label>
                  <AvField
                    id="order-item-totalPrice"
                    type="text"
                    name="totalPrice"
                    validate={{
                      required: { value: true, errorMessage: translate('entity.validation.required') },
                      min: { value: 0, errorMessage: translate('entity.validation.min', { min: 0 }) },
                      number: { value: true, errorMessage: translate('entity.validation.number') }
                    }}
                  />
                </AvGroup>
                <AvGroup>
                  <Label id="statusLabel" for="order-item-status">
                    <Translate contentKey="storeApp.productOrderItem.status">Status</Translate>
                  </Label>
                  <AvInput
                    id="order-item-status"
                    type="select"
                    className="form-control"
                    name="status"
                    value={(!isNew && orderItemEntity.status) || 'AVAILABLE'}
                  >
                    <option value="AVAILABLE">{translate('storeApp.OrderItemStatus.AVAILABLE')}</option>
                    <option value="OUT_OF_STOCK">{translate('storeApp.OrderItemStatus.OUT_OF_STOCK')}</option>
                    <option value="BACK_ORDER">{translate('storeApp.OrderItemStatus.BACK_ORDER')}</option>
                  </AvInput>
                </AvGroup>
                <AvGroup>
                  <Label for="order-item-product">
                    <Translate contentKey="storeApp.productOrderItem.product">Product</Translate>
                  </Label>
                  <AvInput
                    id="order-item-product"
                    type="select"
                    className="form-control"
                    name="product.id"
                    value={isNew ? products[0] && products[0].id : orderItemEntity.product.id}
                    required
                  >
                    {products
                      ? products.map(otherEntity => (
                          <option value={otherEntity.id} key={otherEntity.id}>
                            {otherEntity.name}
                          </option>
                        ))
                      : null}
                  </AvInput>
                  <AvFeedback>
                    <Translate contentKey="entity.validation.required">This field is required.</Translate>
                  </AvFeedback>
                </AvGroup>
                <AvGroup>
                  <Label for="order-item-order">
                    <Translate contentKey="storeApp.productOrderItem.order">Order</Translate>
                  </Label>
                  <AvInput
                    id="order-item-order"
                    type="select"
                    className="form-control"
                    name="order.id"
                    value={isNew ? productOrders[0] && productOrders[0].id : orderItemEntity.order.id}
                    required
                  >
                    {productOrders
                      ? productOrders.map(otherEntity => (
                          <option value={otherEntity.id} key={otherEntity.id}>
                            {otherEntity.code}
                          </option>
                        ))
                      : null}
                  </AvInput>
                  <AvFeedback>
                    <Translate contentKey="entity.validation.required">This field is required.</Translate>
                  </AvFeedback>
                </AvGroup>
                <Button tag={Link} id="cancel-save" to="/entity/order-item" replace color="info">
                  <FontAwesomeIcon icon="arrow-left" />
                  &nbsp;
                  <span className="d-none d-md-inline">
                    <Translate contentKey="entity.action.back">Back</Translate>
                  </span>
                </Button>
                &nbsp;
                <Button color="primary" id="save-entity" type="submit" disabled={updating}>
                  <FontAwesomeIcon icon="save" />
                  &nbsp;
                  <Translate contentKey="entity.action.save">Save</Translate>
                </Button>
              </AvForm>
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (storeState: IRootState) => ({
  products: storeState.product.entities,
  productOrders: storeState.productOrder.entities,
  orderItemEntity: storeState.orderItem.entity,
  loading: storeState.orderItem.loading,
  updating: storeState.orderItem.updating,
  updateSuccess: storeState.orderItem.updateSuccess
});

const mapDispatchToProps = {
  getProducts,
  getProductOrders,
  getEntity,
  updateEntity,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderItemUpdate);
